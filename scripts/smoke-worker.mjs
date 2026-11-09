import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL??'http://127.0.0.1:5173';
let cookie='';
async function call(path,method='GET',body,origin=base){
 const response=await fetch(base+path,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:body?JSON.stringify(body):undefined});
 const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];
 const text=await response.text();let bodyResult;try{bodyResult=JSON.parse(text);}catch{bodyResult={error:text};}return {status:response.status,...bodyResult};
}
const health=await call('/api/health');assert.equal(health.data.mode,'mock','Smoke tests require local mock mode to avoid paid inference');
const bootstrap=await call('/api/session');assert.equal(bootstrap.status,200);
assert.equal((await call('/api/simulations','POST',{},'https://evil.example')).status,403);
assert.equal((await call('/api/simulations','POST',{setup:{}})).status,400);
const created=await call('/api/simulations','POST',{setup:{cashCents:1000000,monthlyCostCents:10000,teamSize:1,employment:'part-time'}});assert.equal(created.status,200);
const id=created.data.run.id;
const turn={requestId:crypto.randomUUID(),expectedVersion:0,idea:'A small useful subscription product',decision:'Interview users',language:'en',history:[]};
const first=await call(`/api/simulations/${id}/turn`,'POST',turn);assert.equal(first.status,200);assert.equal(first.data.run.state.version,1);
const replay=await call(`/api/simulations/${id}/turn`,'POST',turn);assert.equal(replay.data.replayed,true);assert.equal(replay.data.run.state.version,1);
for(let v=1;v<6;v++){const next=await call(`/api/simulations/${id}/turn`,'POST',{...turn,requestId:crypto.randomUUID(),expectedVersion:v});assert.equal(next.status,200);assert.equal(next.data.run.state.version,v+1);if(v===5)assert.equal(next.data.run.state.status,'completed');}
const used=await call('/api/session');assert.equal(used.data.session.used,true);assert.equal(used.data.session.attempts,6);
await call(`/api/simulations/${id}`,'DELETE');assert.equal((await call('/api/simulations','POST',{setup:{cashCents:1000000,monthlyCostCents:10000,teamSize:1,employment:'part-time'}})).status,403);
assert.equal((await call('/api/chat','POST',{})).status,410);
console.log('Worker smoke passed: origin, schema, session, setup, six turns, replay, quota, delete and retired proxy.');
