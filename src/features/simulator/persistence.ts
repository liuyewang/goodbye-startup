import { z } from 'zod';
import { ProposalSchema } from '../../domain/simulation/schema';
const PendingSchema=z.object({requestId:z.string(),expectedVersion:z.number().int(),decision:z.string().max(2000)});
export const TranscriptSchema=z.object({schemaVersion:z.literal(1),runId:z.string(),idea:z.string().max(2000),turns:z.array(z.object({version:z.number().int(),day:z.number(),decision:z.string().max(2000),proposal:ProposalSchema.nullable()})).max(6),pending:PendingSchema.nullable()});
export type Transcript=z.infer<typeof TranscriptSchema>;
type StoragePort=Pick<Storage,'getItem'|'setItem'>;
const key=(id:string)=>'gs_transcript_v1_'+id;
/** Treat every browser save as untrusted text, never server authority. */
export function loadTranscript(id:string,storage:StoragePort):{data:Transcript|null;warning:boolean} {
 try {const raw=storage.getItem(key(id));if(!raw)return {data:null,warning:false};if(raw.length>100000)throw Error('too large');const data=TranscriptSchema.parse(JSON.parse(raw));if(data.runId!==id)throw Error('wrong run');return {data,warning:false};}catch{return {data:null,warning:true};}
}
/** Preserve corrupt saves before replacing them; fail safely if storage is blocked/full. */
export function saveTranscript(data:Transcript,storage:StoragePort):boolean {
 try {const prior=loadTranscript(data.runId,storage);if(prior.warning){const raw=storage.getItem(key(data.runId));if(raw)storage.setItem('gs_transcript_recovery_'+data.runId,raw);}storage.setItem(key(data.runId),JSON.stringify(TranscriptSchema.parse(data)));return true;}catch{return false;}
}
/** Legacy saves are export-only and remain untouched. */
export function readLegacy(storage:StoragePort):string|null {
 try {return storage.getItem('gs_game_state')??storage.getItem('goodbye-startup-state');}catch{return null;}
}
/** Download text using a local object URL; no transcript upload is performed. */
export function downloadRecord(value:unknown,name:string):void {
 const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
