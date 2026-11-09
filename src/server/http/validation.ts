import { z } from 'zod';
export const TurnInputSchema = z.strictObject({
  requestId: z.uuid(), expectedVersion: z.number().int().min(0).max(5),
  idea: z.string().trim().min(1).max(2000), decision: z.string().trim().min(1).max(2000),
  language: z.enum(['en','zh']),
  history: z.array(z.strictObject({role:z.enum(['user','assistant']),content:z.string().max(2000)})).max(12),
}).refine(v=>v.history.reduce((n,m)=>n+m.content.length,0)<=12000);
export type TurnInput = z.infer<typeof TurnInputSchema>;
/** Read streams with a byte limit, including chunked bodies. */
export async function readBounded(stream: ReadableStream<Uint8Array> | null, limit: number): Promise<string> {
  if(!stream) return '';
  const reader=stream.getReader();const decoder=new TextDecoder();let bytes=0;let text='';
  try { while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>limit){await reader.cancel();throw new Error('BODY_TOO_LARGE');}text+=decoder.decode(value,{stream:true});}return text+decoder.decode(); }
  finally {reader.releaseLock();}
}
/** Parses a bounded request without retaining raw body logs. */
export async function readJson(request: Request): Promise<unknown> {
  if(Number(request.headers.get('content-length'))>32768) throw new Error('BODY_TOO_LARGE');
  const text=await readBounded(request.body,32768);
  try{return JSON.parse(text) as unknown;}catch{throw new Error('INVALID_JSON');}
}
/** Browser mutations require exact trusted origin, including protocol and port. */
export function assertOrigin(request: Request,origin: string): void {
  if(request.headers.get('origin')!==origin || new URL(request.url).origin!==origin) throw new Error('FORBIDDEN_ORIGIN');
}
