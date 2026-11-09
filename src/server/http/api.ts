import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { createSimulation } from '../../domain/simulation/engine';
import { SetupSchema } from '../../domain/simulation/schema';
import { Repository } from '../storage/repository';
import { submitTurn } from '../simulation/service';
import { assertOrigin,readJson,TurnInputSchema } from './validation';
import { COOKIE_NAME,hashIdentifier,issueSession,readCookie,verifySession } from './session';

type Action='session'|'create'|'get'|'delete'|'turn'|'health';
const STATUS:Record<string,number>={INVALID_INPUT:400,INVALID_JSON:400,BODY_TOO_LARGE:413,FORBIDDEN_ORIGIN:403,SESSION_REQUIRED:401,RUN_NOT_FOUND:404,RUN_EXPIRED:410,FREE_LIMIT:403,ATTEMPTS_EXHAUSTED:429,DAILY_LIMIT:429,RATE_LIMIT:429,RUN_COMPLETED:409,VERSION_CONFLICT:409,REQUEST_CONFLICT:409,REQUEST_PENDING:409,REQUEST_FAILED:409,REQUEST_EXPIRED:409,STALE_REQUEST:409,AI_TIMEOUT:504,AI_INVALID_RESPONSE:502,AI_UNAVAILABLE:502,SERVICE_UNAVAILABLE:503};
/** Common HTTP envelope and fail-closed production configuration. */
export async function handle(request: Request,action: Action,id?: string): Promise<Response> {
  const requestId=crypto.randomUUID();const headers=new Headers({'Cache-Control':'no-store','Content-Type':'application/json','X-Content-Type-Options':'nosniff'});
  try {
    const url=new URL(request.url);
    const local=env.APP_ENV==='local'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname);
    const config={mode:env.AI_MODE,apiKey:env.DEEPSEEK_API_KEY,model:env.DEEPSEEK_MODEL,allowMock:local};
    const limit=Number(env.AI_DAILY_CALL_LIMIT);
    const ready=!!env.DB && !!env.SESSION_SECRET && env.SESSION_SECRET.length>=32 && limit>0 && ((local&&config.mode==='mock')||(config.mode==='deepseek'&&!!config.apiKey));
    if(action==='health') return Response.json({data:{ready,mode:local?config.mode:'production'},requestId},{status:ready?200:503,headers});
    if(!env.DB||!env.SESSION_SECRET||env.SESSION_SECRET.length<32)throw new Error('SERVICE_UNAVAILABLE');
    if(request.method!=='GET')assertOrigin(request,local?url.origin:env.SITE_ORIGIN);
    const repo=new Repository(env.DB);
    let hash=await verifySession(readCookie(request),env.SESSION_SECRET);
    if(action==='session'&&!hash){
      const cookie=await issueSession(env.SESSION_SECRET);hash=await verifySession(cookie,env.SESSION_SECRET);
      headers.set('Set-Cookie',`${COOKIE_NAME}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=15552000${local?'':'; Secure'}`);
    }
    if(!hash)throw new Error('SESSION_REQUIRED');
    let data:unknown;
    if(action==='session'){
      const session=await repo.getSession(hash,Date.now());
      data={session,run:session.runId&&!session.expired?await repo.getRun(hash,session.runId,Date.now()):null,ready,mode:local?config.mode:'deepseek'};
    }else if(action==='get'){
      data={run:await repo.getRun(hash,id!,Date.now())};
    }else if(action==='delete'){
      await repo.deleteRun(hash,id!,Date.now());data={deleted:true};
    }else{
      if(!ready)throw new Error('SERVICE_UNAVAILABLE');
      // Local mock tests are exempt; production requires the edge limiter binding.
      if(!local){
        if(!env.AI_RATE_LIMITER)throw new Error('SERVICE_UNAVAILABLE');
        const key=await hashIdentifier(`ip:${action}:${request.headers.get('CF-Connecting-IP')??'unknown'}`,env.SESSION_SECRET);
        if(!(await env.AI_RATE_LIMITER.limit({key})).success)throw new Error('RATE_LIMIT');
      }
      const body=await readJson(request);
      if(action==='create'){
        const parsed=z.strictObject({setup:SetupSchema}).safeParse(body);
        if(!parsed.success)throw new Error('INVALID_INPUT');
        data={run:await repo.createRun(hash,createSimulation(parsed.data.setup),Date.now())};
      }else{
        const parsed=TurnInputSchema.safeParse(body);
        if(!parsed.success)throw new Error('INVALID_INPUT');
        data=await submitTurn(repo,hash,id!,parsed.data,config,limit);
      }
    }
    return Response.json({data,requestId},{headers});
  } catch(error) {
    const candidate=error instanceof Error?error.message:'';
    const code=Object.hasOwn(STATUS,candidate)?candidate:'SERVICE_UNAVAILABLE';
    // Do not log bodies, prompts, raw identifiers or upstream error payloads.
    if(code==='SERVICE_UNAVAILABLE')console.error(JSON.stringify({event:'request_failed',requestId,code}));
    if(STATUS[code]===429)headers.set('Retry-After',code==='DAILY_LIMIT'?'3600':'60');
    return Response.json({error:code,code,requestId},{status:STATUS[code],headers});
  }
}
