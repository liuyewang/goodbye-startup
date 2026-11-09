'use client';
import { useCallback,useEffect,useState,type FormEvent } from 'react';
import { z } from 'zod';
import { useI18n } from '../../i18n';
import { getVerdict } from '../../domain/simulation/engine';
import { SetupSchema } from '../../domain/simulation/schema';
import { api,ApiError,BootstrapSchema,RunSchema,TurnResultSchema,type Bootstrap,type Run } from './api';
import { downloadRecord,loadTranscript,readLegacy,saveTranscript,type Transcript } from './persistence';
import { simulatorCopy } from './copy';
import Dashboard from './Dashboard';

const inputClass='mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-dark-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60';
const buttonClass='rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:opacity-50';
const secondaryClass='rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm font-medium text-dark-700 hover:bg-dark-50 disabled:opacity-50';
/** Coordinates server authority and browser-only narrative with explicit recovery states. */
export default function Simulator():React.JSX.Element {
 const {language}=useI18n();const c=simulatorCopy[language];
 const [bootstrap,setBootstrap]=useState<Bootstrap|null>(null);const [run,setRun]=useState<Run|null>(null);const [record,setRecord]=useState<Transcript|null>(null);
 const [idea,setIdea]=useState('');const [cash,setCash]=useState('10000');const [cost,setCost]=useState('1500');const [team,setTeam]=useState('1');const [employment,setEmployment]=useState<'part-time'|'full-time'>('part-time');
 const [decision,setDecision]=useState('');const [busy,setBusy]=useState(false);const [loading,setLoading]=useState(true);const [error,setError]=useState<string|null>(null);
 const [storageWarning,setStorageWarning]=useState(false);const [legacy,setLegacy]=useState<string|null>(null);const [showQuota,setShowQuota]=useState(false);const [confirmDelete,setConfirmDelete]=useState(false);
 function persist(data:Transcript):void {setRecord(data);try{if(!saveTranscript(data,localStorage))setStorageWarning(true);}catch{setStorageWarning(true);}}
 const refresh=useCallback(async()=>{
  setLoading(true);setError(null);
  try{const result=await api('/api/session',BootstrapSchema);setBootstrap(result);setRun(result.run);
   try{setLegacy(readLegacy(localStorage));const id=result.run?.id??result.session.runId;if(id){const saved=loadTranscript(id,localStorage);setRecord(saved.data);setStorageWarning(saved.warning);if(saved.data){setIdea(saved.data.idea);setDecision(saved.data.pending?.decision??'');}}}catch{setStorageWarning(true);}
  }catch(e){setError(e instanceof ApiError?e.code:'NETWORK');}finally{setLoading(false);}
 },[]);
 useEffect(()=>{void refresh();},[refresh]);
 async function submit(target:Run,text:string,prior:Transcript|null=record):Promise<void> {
  if(busy)return;
  if(!idea.trim()||!text.trim()||idea.length>2000||text.length>2000){setError('INVALID_INPUT');return;}
  setBusy(true);setError(null);setDecision(text);
  const base:Transcript=prior??{schemaVersion:1,runId:target.id,idea,turns:[],pending:null};
  const pending=base.pending??{requestId:crypto.randomUUID(),expectedVersion:target.state.version,decision:text};
  const next={...base,idea,pending};persist(next);
  const history=base.turns.flatMap(turn=>[{role:'user' as const,content:turn.decision},{role:'assistant' as const,content:turn.proposal?.scenario??''}]).slice(-12);
  while(history.reduce((n,m)=>n+m.content.length,0)>12000)history.shift();
  try{
   const result=await api(`/api/simulations/${target.id}/turn`,TurnResultSchema,'POST',{...pending,idea,language,history});
   setRun(result.run);persist({...next,pending:null,turns:result.proposal?[...base.turns.filter(t=>t.version!==result.run.state.version),{version:result.run.state.version,day:result.run.state.day,decision:text,proposal:result.proposal}].slice(-6):base.turns});setDecision('');
   setBootstrap(prev=>prev?{...prev,session:{...prev.session,used:true}}:prev);
  }catch(e){const code=e instanceof ApiError?e.code:'NETWORK';setError(code);if(!['NETWORK','REQUEST_PENDING','REQUEST_CONFLICT'].includes(code))persist({...next,pending:null});}
  finally{setBusy(false);}
 }
 async function begin(event:FormEvent):Promise<void> {
  event.preventDefault();if(busy)return;setError(null);
  const parsed=SetupSchema.safeParse({cashCents:Math.round(Number(cash)*100),monthlyCostCents:Math.round(Number(cost)*100),teamSize:Number(team),employment});
  if(!parsed.success||!idea.trim()||idea.length>2000){setError('INVALID_INPUT');return;}
  setBusy(true);
  let created:Run;
  try{created=(await api('/api/simulations',z.object({run:RunSchema}),'POST',{setup:parsed.data})).run;setRun(created);}
  catch(e){setError(e instanceof ApiError?e.code:'NETWORK');setBusy(false);return;}
  setBusy(false);
  const initial:Transcript={schemaVersion:1,runId:created.id,idea,turns:[],pending:null};persist(initial);
  // Pass the created run directly; React's next render has not happened yet.
  await submit(created,c.startDecision,initial);
 }
 async function remove():Promise<void> {if(!run)return;setBusy(true);try{await api(`/api/simulations/${run.id}`,z.object({deleted:z.boolean()}),'DELETE');setRun(null);setConfirmDelete(false);await refresh();}catch(e){setError(e instanceof ApiError?e.code:'NETWORK');}finally{setBusy(false);}}
 const latest=record?.turns.at(-1)?.proposal;
 const missing=!!run&&run.state.version>(record?.turns.at(-1)?.version??0);
 const blocked=!!bootstrap&&(bootstrap.session.used||bootstrap.session.attempts>=10);
 const terminal=run?.state.status==='completed';const verdict=run?getVerdict(run.state):null;
 const errorText=error?(Object.hasOwn(c.errors,error)?c.errors[error as keyof typeof c.errors]:c.errors.SERVICE_UNAVAILABLE):null;
 return <div className="mx-auto max-w-5xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
  <header className="mb-8 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-600">Goodbye Startup</p><h1 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-5xl">{c.title}</h1><p className="mt-4 leading-relaxed text-dark-500">{c.subtitle}</p></header>
  {bootstrap?.mode==='mock'&&<p className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{c.mock}</p>}
  {legacy&&<div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-dark-200 p-3 text-sm"><p>{c.legacy}</p><button className={secondaryClass} onClick={()=>downloadRecord({legacy},'goodbye-legacy-save.json')}>{c.legacyExport}</button></div>}
  {storageWarning&&<p role="status" className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-900">{c.storage}</p>}
  {errorText&&<div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"><p>{errorText}</p><div className="mt-3 flex flex-wrap gap-2">{run&&!terminal&&!['ATTEMPTS_EXHAUSTED','FREE_LIMIT','RUN_EXPIRED','RUN_NOT_FOUND'].includes(error!)&&<button className={secondaryClass} disabled={busy} onClick={()=>void submit(run,record?.pending?.decision??decision)}>{c.retry}</button>}<button className={secondaryClass} disabled={busy} onClick={()=>void refresh()}>{c.refresh}</button></div></div>}
  {loading?<p role="status" className="py-10 text-dark-500">{c.loading}</p>:<>
   {!run&&bootstrap?.session.expired&&<p className="mb-5 rounded-xl bg-amber-50 p-4">{c.expired}</p>}
   {!run&&blocked?<div className="rounded-2xl border border-dark-200 p-6"><h2 className="font-semibold">{bootstrap?.session.attempts===10&&!bootstrap.session.used?c.errors.ATTEMPTS_EXHAUSTED:c.used}</h2><p className="mt-2 text-dark-500">{c.paid}</p></div>:!run&&<form onSubmit={begin} className="space-y-5 rounded-2xl border border-dark-200 bg-white p-5 shadow-sm sm:p-8">
    <label className="block font-medium">{c.idea}<textarea className={inputClass} value={idea} onChange={e=>setIdea(e.target.value)} maxLength={2000} rows={4} required disabled={busy}/></label>
    <div className="grid gap-5 sm:grid-cols-2">{[[c.cash,cash,setCash,'1','10000000'],[c.cost,cost,setCost,'0','1000000'],[c.team,team,setTeam,'1','50']].map(([label,value,set,min,max])=><label className="block text-sm font-medium" key={label as string}>{label as string}<input className={inputClass} type="number" min={min as string} max={max as string} step={label===c.team?'1':'0.01'} value={value as string} onChange={e=>(set as (v:string)=>void)(e.target.value)} required disabled={busy}/></label>)}
    <label className="block text-sm font-medium">{c.employment}<select className={inputClass} value={employment} onChange={e=>setEmployment(e.target.value==='full-time'?'full-time':'part-time')} disabled={busy}><option value="part-time">{c.part}</option><option value="full-time">{c.full}</option></select></label></div>
    <p className="text-sm leading-relaxed text-dark-500">{c.free}</p><button className={buttonClass} disabled={busy||bootstrap?.ready===false}>{busy?c.busy:c.begin}</button>{bootstrap?.ready===false&&<p role="status" className="text-sm text-amber-800">{c.errors.SERVICE_UNAVAILABLE}</p>}
   </form>}
   {run&&<div className="space-y-6"><Dashboard state={run.state}/>
    {missing&&<p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{c.missing}</p>}
    {record?.pending&&<p className="text-sm text-dark-500">{c.pending}</p>}
    {latest&&<section className="rounded-2xl border border-dark-200 bg-white p-5 sm:p-7"><h2 className="mb-3 text-sm font-semibold text-primary-700">{c.assumptions}</h2><p className="whitespace-pre-wrap break-words leading-relaxed">{latest.scenario}</p><ul className="mt-4 space-y-2 text-dark-600">{latest.insights.map((item,i)=><li key={i} className="break-words">{item.text}</li>)}</ul><details className="mt-5 text-sm text-dark-500"><summary className="cursor-pointer font-medium">{c.assumptionsLabel}</summary><dl className="mt-3 grid grid-cols-2 gap-3">{[[c.visits,latest.visits],[c.signup,`${latest.signupRate*100}%`],[c.paidRate,`${latest.paidRate*100}%`],[c.churn,`${latest.monthlyChurn*100}%`],[c.price,`$${latest.priceCents/100}`],[c.oneTime,`$${latest.oneTimeCostCents/100}`]].map(([k,v])=><div key={k}><dt>{k}</dt><dd className="font-medium text-dark-800">{v}</dd></div>)}</dl></details></section>}
    {terminal?<section className="rounded-2xl bg-dark-900 p-6 text-white"><h2 className="text-xl font-bold">{c.complete}</h2><p className="mt-3 text-lg">{verdict?c[verdict]:''}</p><p className="mt-3 text-sm text-dark-300">{c.verdictNote}</p><button onClick={()=>setShowQuota(true)} className="mt-5 rounded-lg bg-white px-4 py-2 font-semibold text-dark-900">{c.another}</button>{showQuota&&<div className="mt-4"><p>{c.used}</p><p className="mt-2 text-sm text-dark-300">{c.paid}</p></div>}</section>:<form onSubmit={e=>{e.preventDefault();void submit(run,decision);}} className="rounded-2xl border border-dark-200 p-5 sm:p-7">
     {!record?.idea&&<label className="mb-4 block text-sm font-medium">{c.restoreIdea}<textarea aria-label={c.idea} className={inputClass} value={idea} onChange={e=>setIdea(e.target.value)} maxLength={2000} required/></label>}
     {latest&&<div className="mb-5 grid gap-2 sm:grid-cols-3">{latest.choices.map(choice=><button type="button" key={choice} className={secondaryClass+' text-left'} disabled={busy} onClick={()=>void submit(run,choice)}>{choice}</button>)}</div>}
     <label className="block text-sm font-semibold">{c.decision}<textarea className={inputClass} value={decision} onChange={e=>setDecision(e.target.value)} rows={3} maxLength={2000} required disabled={busy} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();void submit(run,decision);}}}/></label><button className={buttonClass+' mt-4'} disabled={busy||!decision.trim()}>{busy?c.busy:c.send}</button><p role="status" aria-live="polite" className="mt-2 text-sm text-dark-500">{busy?c.busy:''}</p>
    </form>}
    {record&&record.turns.length>0&&<details className="rounded-xl border border-dark-200 p-4"><summary className="cursor-pointer font-semibold">{c.history}</summary><ol className="mt-4 space-y-4">{record.turns.map(turn=><li key={turn.version} className="border-l-2 border-primary-200 pl-4"><p className="text-sm font-semibold">{language==='zh'?`模拟内第 ${turn.day} 天`:`Simulated Day ${turn.day}`}</p><p className="mt-1 break-words text-sm text-dark-600">{turn.decision}</p><p className="mt-1 break-words text-sm text-dark-500">{turn.proposal?.scenario}</p></li>)}</ol></details>}
   </div>}
  </>}
  {(record||run)&&<div className="mt-6 flex flex-wrap gap-3"><button className={secondaryClass} onClick={()=>downloadRecord({record,state:run?.state??null,exportedAt:new Date().toISOString()},'goodbye-simulation.json')}>{c.export}</button>{run&&<button className={secondaryClass} disabled={busy} onClick={()=>setConfirmDelete(true)}>{c.delete}</button>}</div>}
  {confirmDelete&&<div className="mt-4 rounded-xl border border-red-200 p-4"><p>{c.deleteConfirm}</p><div className="mt-3 flex gap-3"><button className={secondaryClass} onClick={()=>setConfirmDelete(false)}>{c.cancel}</button><button className={secondaryClass} disabled={busy} onClick={()=>void remove()}>{c.confirm}</button></div></div>}
  <p className="mt-7 text-xs leading-relaxed text-dark-500">{c.privacy}</p>
  <section className="mt-12 border-t border-dark-200 pt-8"><h2 className="text-xl font-semibold">{c.guide}</h2><p className="mt-3 max-w-3xl leading-relaxed text-dark-500">{c.guideText}</p></section>
 </div>;
}
