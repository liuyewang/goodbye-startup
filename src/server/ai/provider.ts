import { z } from 'zod';
import { ProposalSchema, type Proposal, type SimulationState } from '../../domain/simulation/schema';
import { TIMELINE } from '../../domain/simulation/engine';
import { readBounded } from '../http/validation';
import { PROMPT_VERSION, SYSTEM_PROMPT } from './prompt';
export type AiInput = { idea:string;decision:string;history:{role:'user'|'assistant';content:string}[];language:'en'|'zh';state:SimulationState };
export type AiConfig = {mode:string;apiKey?:string;model:string;allowMock:boolean};
export type Usage = { promptVersion:string;model:string;inputTokens:number;outputTokens:number };
export type GeneratedProposal = {proposal:Proposal;usage:Usage};
const EnvelopeSchema=z.object({choices:z.array(z.object({finish_reason:z.literal('stop'),message:z.object({content:z.string().min(1)})})).min(1),usage:z.object({prompt_tokens:z.number().int().nonnegative(),completion_tokens:z.number().int().nonnegative()}).optional()});
/** Local deterministic fixture. Production cannot enable this path. */
function mock(input: AiInput): GeneratedProposal {
  const zh=input.language==='zh';
  return {proposal:ProposalSchema.parse({visits:1000+input.state.version*400,signupRate:.1,paidRate:.1,monthlyChurn:.05,priceCents:2000,monthlyCostCents:input.state.setup.monthlyCostCents,oneTimeCostCents:0,moraleDelta:-2,scenario:zh?'早期用户愿意尝试，但付费意愿仍需验证。':'Early users are curious, but willingness to pay still needs testing.',insights:[{text:zh?'通过访谈验证最紧迫的需求。':'Interview customers to test their most urgent need.',metric:'customers'}],choices:zh?['访谈潜在用户','改善首次使用体验','减少固定支出']:['Interview potential customers','Improve onboarding','Reduce fixed costs']}),usage:{promptVersion:PROMPT_VERSION,model:'local-fixture',inputTokens:0,outputTokens:0}};
}
/** One bounded provider call. Invalid output never advances the simulation. */
export async function generateProposal(input: AiInput,config: AiConfig,fetcher: typeof fetch=fetch,timeoutMs=45_000): Promise<GeneratedProposal> {
  if(config.mode==='mock'){if(!config.allowMock)throw new Error('SERVICE_UNAVAILABLE');return mock(input);}
  if(config.mode!=='deepseek'||!config.apiKey||!config.model)throw new Error('SERVICE_UNAVAILABLE');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try {
    const response=await fetcher('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.apiKey}`},signal:controller.signal,body:JSON.stringify({model:config.model,response_format:{type:'json_object'},max_tokens:4096,stream:false,messages:[{role:'system',content:SYSTEM_PROMPT},{role:'user',content:JSON.stringify({...input,nextDay:TIMELINE[input.state.version],promptVersion:PROMPT_VERSION})}]})});
    if(!response.ok){await response.body?.cancel();throw new Error('AI_UNAVAILABLE');}
    let parsed: z.infer<typeof EnvelopeSchema>;
    try {parsed=EnvelopeSchema.parse(JSON.parse(await readBounded(response.body,131072)));}catch{throw new Error('AI_INVALID_RESPONSE');}
    try {return {proposal:ProposalSchema.parse(JSON.parse(parsed.choices[0].message.content)),usage:{promptVersion:PROMPT_VERSION,model:config.model,inputTokens:parsed.usage?.prompt_tokens??0,outputTokens:parsed.usage?.completion_tokens??0}};}catch{throw new Error('AI_INVALID_RESPONSE');}
  } catch(error) {
    if(controller.signal.aborted)throw new Error('AI_TIMEOUT');
    if(error instanceof Error&&['AI_UNAVAILABLE','AI_INVALID_RESPONSE'].includes(error.message))throw error;
    throw new Error('AI_UNAVAILABLE');
  } finally {clearTimeout(timer);}
}
