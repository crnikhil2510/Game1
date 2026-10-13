const assert=require('node:assert/strict'),E=require('./engine.js');
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
function route(s,predicate){
 const q=[{s:{...s},path:[]}],seen=new Set();
 while(q.length){const {s:v,path}=q.shift();const key=v.map+':'+v.x+','+v.y;if(seen.has(key))continue;seen.add(key);if(predicate(v)){for(const d of path)assert(E.move(s,...d));return;}for(const d of dirs){const next={...v};if(E.move(next,...d))q.push({s:next,path:[...path,d]});}}
 throw Error('No reachable route from '+s.map);
}
function meet(s,map,name){route(s,v=>v.map===map&&E.nearby(v)?.name===name);return E.talk(s,E.nearby(s));}
function examine(s,map,kind){route(s,v=>v.map===map&&E.nearby(v)?.kind===kind);return E.talk(s,E.nearby(s));}
for(const m of Object.values(E.maps)){
 for(const p of m.portals){assert(E.maps[p.to],p.to);assert(E.walkable(E.maps[p.to],p.tx,p.ty),'Blocked arrival: '+m.id+' -> '+p.to);}
 const start=E.fresh();route(start,v=>v.map===m.id);
 for(const n of [...m.npcs,...m.objects]){const s=E.fresh();route(s,v=>v.map===m.id&&E.nearby(v)===n);}
}
const s=E.fresh();
assert(!E.move({...s,x:1,y:1},-1,0),'Wall must block walking');
assert(!E.walkable(E.maps.campus,9,8),'NPC must block walking');
assert(!examine(s,'clubroom','join').choices,'Cannot join before captain');
meet(s,'campus','Kaito').choices[0][1]();assert.equal(s.stage,1);
meet(s,'classroom','Hiratsuka');assert.equal(s.stage,2);
for(const name of ['Yukino','Kei','Hiyori'])meet(s,'classroom',name).choices[0][1]();
assert.equal(s.stage,3);
meet(s,'cafeteria','Kaito');assert.equal(s.stage,4);
meet(s,'pitch','Captain');assert.equal(s.stage,5);
examine(s,'clubroom','join').choices[1][1]();assert(!s.joined);
examine(s,'clubroom','join').choices[0][1]();assert(s.joined);assert.equal(s.stage,6);
assert(examine(s,'pitch','training').training);
assert(E.finishTraining(s,4));assert.equal(s.stage,7);assert.equal(s.passing,62);assert(s.log.some(x=>x.includes('Gun:')));
assert(!E.finishTraining(s,5),'Ending should only fire once');
assert(E.validSave(JSON.parse(JSON.stringify(s))));
assert(!E.validSave({...s,map:'bad'}));assert(!E.validSave({...s,x:-1}));assert(!E.validSave({...s,rapport:null}));
console.log('PASS: 13 maps and all doors/objects reachable; episode choices, club gates, training, ending, collision and saves.');
