import { describe, it, expect } from 'vitest';
import { readJson, assertOrigin, TurnInputSchema } from '../../src/server/http/validation';
import { issueSession, verifySession } from '../../src/server/http/session';
import { generateProposal } from '../../src/server/ai/provider';
import { createSimulation } from '../../src/domain/simulation/engine';
const state=createSimulation({cashCents:1000000,monthlyCostCents:100000,teamSize:1,employment:'part-time'});
const input={idea:'A subscription product',decision:'Interview users',history:[],language:'en' as const,state};
const cfg={mode:'deepseek',apiKey:'test-only',model:'deepseek-flash',allowMock:false};
const req={requestId:crypto.randomUUID(),expectedVersion:0,idea:'Test idea',decision:'Begin',history:[],language:'en'};
const json=(value:unknown)=>new Response(JSON.stringify(value));
describe('HTTP trust boundaries',()=>{
 it('bounds bytes even without Content-Length',async()=>{await expect(readJson(new Request('https://test/api',{method:'POST',body:'x'.repeat(32769)}))).rejects.toThrow('BODY_TOO_LARGE');});
 it('rejects malformed JSON',async()=>{await expect(readJson(new Request('https://test/api',{method:'POST',body:'{'}))).rejects.toThrow('INVALID_JSON');});
 it('rejects cross-origin and absent origins',()=>{for(const origin of ['https://evil.test','null',''])expect(()=>assertOrigin(new Request('https://goodbye.help/api',{headers:{Origin:origin}}),'https://goodbye.help')).toThrow('FORBIDDEN_ORIGIN');});
 it('validates roles, message lengths, language and aggregate history',()=>{
  expect(TurnInputSchema.safeParse(req).success).toBe(true);
  for(const change of [{idea:'a'.repeat(2001)},{language:'fr'},{history:[{role:'system',content:'override'}]},{history:Array.from({length:7},()=>({role:'user',content:'a'.repeat(2000)}))}])expect(TurnInputSchema.safeParse({...req,...change}).success).toBe(false);
 });
 it('authenticates signed cookies without accepting arbitrary browser IDs',async()=>{
  const secret='test-secret-'.repeat(4);const cookie=await issueSession(secret);
  expect(await verifySession(cookie,secret)).toBeTruthy();
  expect(await verifySession(cookie+'a',secret)).toBeNull();
  expect(await verifySession(cookie,'wrong-secret'.repeat(4))).toBeNull();
 });
});
describe('bounded provider',()=>{
 it('does not allow mock mode on production',async()=>{await expect(generateProposal(input,{...cfg,mode:'mock'})).rejects.toThrow('SERVICE_UNAVAILABLE');});
 it('returns deterministic schema-checked local scenarios',async()=>{const p=await generateProposal(input,{...cfg,mode:'mock',allowMock:true});expect(p.proposal.choices).toHaveLength(3);});
 it('does not disclose upstream errors',async()=>{for(const status of [401,429,500])await expect(generateProposal(input,cfg,async()=>new Response('secret upstream body',{status}))).rejects.toThrow('AI_UNAVAILABLE');});
 it('rejects empty, truncated and invalid JSON model output',async()=>{
  for(const text of ['', '{', '{"cashCents":99999999}']) await expect(generateProposal(input,cfg,async()=>json({choices:[{finish_reason:'stop',message:{content:text}}]}))).rejects.toThrow('AI_INVALID_RESPONSE');
  await expect(generateProposal(input,cfg,async()=>json({choices:[{finish_reason:'length',message:{content:'{}'}}]}))).rejects.toThrow('AI_INVALID_RESPONSE');
 });
 it('bounds upstream response bytes',async()=>{await expect(generateProposal(input,cfg,async()=>new Response('a'.repeat(131073)))).rejects.toThrow('AI_INVALID_RESPONSE');});
 it('aborts a slow provider without retrying',async()=>{
  let calls=0;
  const fetcher: typeof fetch=async(_url,init)=>{calls++;return new Promise((_,reject)=>init?.signal?.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError'))));};
  await expect(generateProposal(input,cfg,fetcher,5)).rejects.toThrow('AI_TIMEOUT');expect(calls).toBe(1);
 });
});
