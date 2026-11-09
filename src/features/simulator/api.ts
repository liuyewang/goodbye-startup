import { z } from 'zod';
import { ProposalSchema,SimulationStateSchema } from '../../domain/simulation/schema';
export const RunSchema=z.object({id:z.string(),state:SimulationStateSchema,expiresAt:z.number()});
export const SessionSchema=z.object({used:z.boolean(),attempts:z.number(),runId:z.string().nullable(),expired:z.boolean(),eligibleAt:z.number().nullable()});
export const BootstrapSchema=z.object({session:SessionSchema,run:RunSchema.nullable(),ready:z.boolean(),mode:z.string()});
export const TurnResultSchema=z.object({run:RunSchema,proposal:ProposalSchema.nullable(),replayed:z.boolean()});
export type Run=z.infer<typeof RunSchema>;
export type Bootstrap=z.infer<typeof BootstrapSchema>;
export class ApiError extends Error {constructor(readonly code:string,readonly requestId?:string){super(code);}}
/** Validates server envelopes; a network error keeps the operation ID for safe replay. */
export async function api<T>(path:string,schema:z.ZodType<T>,method='GET',body?:unknown):Promise<T> {
 let response:Response;
 try {response=await fetch(path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});}catch{throw new ApiError('NETWORK');}
 const result=z.object({data:z.unknown().optional(),code:z.string().optional(),requestId:z.string().optional()}).safeParse(await response.json());
 if(!result.success)throw new ApiError('NETWORK');
 if(!response.ok)throw new ApiError(result.data.code??'SERVICE_UNAVAILABLE',result.data.requestId);
 return schema.parse(result.data.data);
}
