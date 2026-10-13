(function(root){
'use strict';
const W=24,H=16;
const maps={};
function room(id,name,type){const grid=Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>(x===0||y===0||x===W-1||y===H-1)?'#':'.'));maps[id]={id,name,type,grid,portals:[],npcs:[],objects:[]};return maps[id];}
function block(m,x,y,w,h,t='#'){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)m.grid[j][i]=t;}
function obj(m,x,y,label,kind,lines){m.objects.push({x,y,label,kind,lines});m.grid[y][x]='F';}
function door(m,x,y,to,tx,ty,label){m.grid[y][x]='.';m.portals.push({x,y,to,tx,ty,label});}
function npc(m,x,y,name){m.npcs.push({x,y,name});}
const bed=room('bedroom',"Hachiman's bedroom",'wood');
// Collision cells follow the illustrated bedroom's visible floor and furniture.
for(let y=0;y<H;y++)for(let x=0;x<W;x++)bed.grid[y][x]='#';
for(let y=6;y<=11;y++)for(let x=7;x<=20;x++)bed.grid[y][x]='.';
for(let y=10;y<=11;y++)for(let x=4;x<=20;x++)bed.grid[y][x]='.';
for(let x=3;x<=20;x++)bed.grid[12][x]='.';
for(let y=13;y<H;y++)for(let x=11;x<=13;x++)bed.grid[y][x]='.';
block(bed,10,6,2,1,'F');
obj(bed,6,8,'Bed','rest',['One more minute would be nice.','But it is the first day of school.']);
obj(bed,13,5,'Desk','desk',['Three promises: decent grades, quiet lunches, no football.','My notebook makes that sound easy.']);
obj(bed,18,5,'Bookshelf','book',['Some stories are easier to return to than others.']);
door(bed,12,15,'living',12,2,'Downstairs');
const living=room('living','Home · living room','wood');
block(living,4,5,4,2,'F');obj(living,5,4,'Breakfast','food',['Breakfast before another perfectly ordinary day.']);
obj(living,18,4,'Photo album','photo',['Six boys. One trophy. Gun stood in the middle.','We won nationals in our first year. After that, none of us played again.']);
door(living,12,0,'bedroom',12,14,'Bedroom');door(living,12,15,'street',5,6,'Leave home');
const street=room('street','Residential neighbourhood','town');
block(street,2,1,6,4,'B');block(street,15,1,6,5,'B');block(street,2,10,6,4,'B');block(street,16,10,5,4,'B');
door(street,5,5,'living',12,14,'Home');door(street,23,8,'city',1,8,'City centre');
obj(street,10,3,'Neighbourhood noticeboard','sign',['Minami Seiryu · school entrance past the city square.']);
const city=room('city','Kagoshima · city square','town');
block(city,2,1,6,4,'B');block(city,15,1,7,4,'B');block(city,2,11,6,4,'B');
obj(city,12,11,'Fountain','fountain',['The water keeps moving. A useful example.']);
door(city,0,8,'street',22,8,'Neighbourhood');door(city,5,5,'cafe',12,14,'Cafe');door(city,18,5,'shop',12,14,'Corner shop');door(city,23,8,'campus',1,8,'School gate');
const cafe=room('cafe','Harbour cafe','wood');
for(const x of [4,10,17])block(cafe,x,5,3,2,'F');
obj(cafe,18,2,'Cafe counter','cafe',['A quiet cafe overlooking the bay.','After school, this might be a good place to read.']);
door(cafe,12,15,'city',5,6,'City square');
const shop=room('shop','Corner shop','tile');
for(const x of [4,10,16])block(shop,x,4,2,6,'F');
obj(shop,19,2,'Shop counter','shop',['Lunch bread, notebooks, and far too many energy drinks.','I already brought lunch.']);
door(shop,12,15,'city',18,6,'City square');
const campus=room('campus','Minami Seiryu · courtyard','garden');
block(campus,4,1,16,4,'B');for(const x of [3,20]){block(campus,x,10,2,2,'T');block(campus,x,6,2,2,'T');}
door(campus,0,8,'city',22,8,'City');door(campus,12,5,'corridor',12,13,'School entrance');door(campus,23,8,'pitch',1,8,'Football ground');
npc(campus,9,8,'Kaito');obj(campus,16,7,'Club recruitment board','poster',['FOOTBALL CLUB · visitors welcome.','Kaito reads the leaflet longer than he needs to.']);
const hall=room('corridor','School · ground-floor corridor','tile');
block(hall,1,1,22,3,'B');
door(hall,4,4,'classroom',12,13,'Class 1-A');door(hall,11,4,'cafeteria',12,13,'Cafeteria');door(hall,19,4,'library',12,13,'Library');door(hall,12,15,'campus',12,6,'Courtyard');
obj(hall,20,10,'School noticeboard','sign',['Class 1-A on the left. Cafeteria in the middle. Library on the right.']);
const classroom=room('classroom','School · Class 1-A','wood');
for(const y of [5,8])for(const x of [4,9,16])block(classroom,x,y,2,1,'F');
obj(classroom,11,2,'Blackboard','board',['Welcome to Minami Seiryu · Class 1-A.']);
npc(classroom,6,6,'Yukino');npc(classroom,12,7,'Kei');npc(classroom,18,6,'Hiyori');npc(classroom,11,3,'Hiratsuka');npc(classroom,7,10,'Kaito');
door(classroom,12,15,'corridor',4,5,'Corridor');
const canteen=room('cafeteria','School · cafeteria','tile');
for(const x of [4,10,17])block(canteen,x,6,3,2,'F');
obj(canteen,18,2,'Lunch counter','food',['Lunch smells better than paperwork.']);
npc(canteen,8,10,'Yukino');npc(canteen,12,10,'Kei');npc(canteen,17,10,'Hiyori');npc(canteen,5,10,'Kaito');
door(canteen,12,15,'corridor',11,5,'Corridor');
const library=room('library','School · library','wood');
for(const x of [3,8,16])block(library,x,2,2,7,'F');
npc(library,12,8,'Hiyori');obj(library,19,10,'Reading table','book',['An open book. An empty chair.','A strong candidate for my quiet lunch spot.']);
door(library,12,15,'corridor',19,5,'Corridor');
const pitch=room('pitch','Football ground','grass');
door(pitch,0,8,'campus',22,8,'Courtyard');door(pitch,12,15,'clubroom',12,2,'Clubroom');
npc(pitch,7,8,'Captain');npc(pitch,16,7,'Kaito');
obj(pitch,20,12,'Passing drill','training',['A short drill. Nothing more.']);
obj(pitch,3,12,'Team bench','bench',['A perfectly good place to watch.']);
const club=room('clubroom','Football club · changing room','tile');
block(club,3,3,2,7,'F');block(club,19,3,2,7,'F');block(club,8,6,8,1,'F');
obj(club,12,10,'Trial forms','join',['One week. Observe first. No tournament commitment.']);
obj(club,17,11,'Ball basket','basket',['Kaito: Even borrowing a ball feels familiar.']);
door(club,12,0,'pitch',12,14,'Football ground');
const hints=['Leave home and meet Kaito in the school courtyard.','Go to Class 1-A and talk to Hiratsuka.','Meet Yukino, Kei and Hiyori in Class 1-A.','Talk to Kaito in the cafeteria.','Visit the football ground and talk to the captain.','Enter the clubroom and examine the trial forms.','Try the passing drill on the football ground.','Episode 1 complete. Explore, train, or read your journal.'];
function fresh(){return {version:1,map:'bedroom',x:12,y:10,stage:0,met:[],trust:0,rapport:{Yukino:0,Kei:0,Hiyori:0},passing:60,xp:0,joined:false,log:['Day 1 · A simple life. That was the plan.'],trainingCount:0};}
function walkable(m,x,y){return x>=0&&y>=0&&x<W&&y<H&&m.grid[y][x]==='.'&&!m.npcs.some(n=>n.x===x&&n.y===y);}
function move(s,dx,dy){const m=maps[s.map],x=s.x+dx,y=s.y+dy;if(!walkable(m,x,y))return false; s.x=x;s.y=y;const p=m.portals.find(p=>p.x===x&&p.y===y);if(p){s.map=p.to;s.x=p.tx;s.y=p.ty;}return true;}
function nearby(s){const m=maps[s.map];return [...m.npcs,...m.objects].filter(n=>Math.abs(n.x-s.x)+Math.abs(n.y-s.y)<=1).sort((a,b)=>(Math.abs(a.x-s.x)+Math.abs(a.y-s.y))-(Math.abs(b.x-s.x)+Math.abs(b.y-s.y)))[0];}
function note(s,line){s.log.push(line);}
function talk(s,n){
 if(n.name==='Kaito'){
  if(s.stage===0){s.stage=1;note(s,'Met Kaito at the gate. He still wants to play.');return {speaker:'Kaito',lines:['Same high school. What are the chances?','Hachiman: You knew.','Maybe. I saw the football club poster.','Hachiman: I want a simple life. Classes, lunch, home.','Kaito: Then let us find our classroom.'],choices:[['You can play without me.',()=>{s.trust++;note(s,'Told Kaito he can decide for himself.');}],['We can look. Looking is not joining.',()=>{s.trust++;note(s,'Agreed to look around.');}]]};}
  if(s.map==='cafeteria'&&s.stage===3){s.stage=4;note(s,'At lunch, agreed to visit the football club together.');return {speaker:'Kaito',lines:['I do want to play again. But I thought starting together would be easier.','Hachiman: You do not have to wait for me.','Kei: You are both allowed to choose.','Hiyori: Watching can be enough for a first day.','Yukino: Let him answer for himself.','Hachiman: Only a visit. No surprise match.','Kaito: Deal.']};}
  return {speaker:'Kaito',lines:[s.joined?'A trial is enough. Thanks for coming with me.':'We won together once. I do not need you to promise another trophy.']};
 }
 if(n.name==='Hiratsuka'){
  if(s.stage===1){s.stage=2;note(s,'Homeroom began. Meet your classmates.');}
  return {speaker:'Hiratsuka',lines:['Welcome to Minami Seiryu. I am your homeroom teacher.','Make friends. Discover interests. Please complete your forms.','Start by introducing yourself to your classmates.']};
 }
 if(['Yukino','Kei','Hiyori'].includes(n.name)){
  const name=n.name;
  if(s.stage>=2&&!s.met.includes(name)){s.met.push(name);note(s,'Met '+name+'.');if(s.met.length===3){s.stage=Math.max(s.stage,3);note(s,'Everyone is heading to the cafeteria.');}}
  const lines={Yukino:['Yukino Yukinoshita. If you intend to complain all year, lower your voice.','Hachiman: Does the seating come with conditions?','Most things do. People neglect to read them.'],Kei:['Kei Karuizawa. Do you always look this unhappy?','Hachiman: It is my ordinary face.','Then we will have to find something that makes you smile.'],Hiyori:['Hiyori Shiina. Thank you for helping with the books.','Hachiman: Reading is a useful way to avoid talking.','Sometimes it helps you find something to talk about.']};
  if(s.stage<2)return {speaker:name,lines:['Homeroom is about to begin. Talk to Hiratsuka first.']};
  return {speaker:name,lines:lines[name],choices:[['Answer honestly.',()=>{s.rapport[name]++;note(s,'A quiet conversation with '+name+'.');}],['Make a gentle joke.',()=>{s.rapport[name]++;note(s,'Shared a smile with '+name+'.');}]]};
 }
 if(n.name==='Captain'){
  if(s.stage<4)return {speaker:'Captain',lines:['Visitors are welcome. Settle into your class first.','You can come back after lunch. No match today.']};
  if(s.stage===4){s.stage=5;note(s,'Captain offered a no-pressure trial.');}
  return {speaker:'Captain',lines:['You have played before?','Hachiman: A little.','Kaito: That is one way to put it.','You can observe. Or try a short passing drill.','Trial forms are in the clubroom. No tournament commitment.']};
 }
 if(n.kind==='join'){
  if(s.stage<5)return {speaker:'Hachiman',lines:['I should speak to the captain before signing anything.']};
  if(s.joined)return {speaker:'Hachiman',lines:['A trial. I have already signed.']};
  return {speaker:'Kaito',lines:['You do not have to do this for me.','Hachiman: A trial. I watch first.','Kaito: Okay.'],choices:[['Sign the one-week trial.',()=>{s.joined=true;s.stage=6;s.trust+=2;note(s,'Signed trial membership with Kaito.');}],['Think about it a little longer.',()=>note(s,'The trial form can wait.')] ]};
 }
 if(n.kind==='training'){
  if(!s.joined)return {speaker:'Kaito',lines:['Let us speak to the captain and decide about the trial first.']};
  return {speaker:'Kaito',lines:['Five passes. Press Space when the marker reaches the gold zone.','There is no match today. Just find the rhythm again.'],training:true};
 }
 return {speaker:'Hachiman',lines:n.lines||['Nothing unusual here.']};
}
function finishTraining(s,hits){s.passing=Math.min(99,s.passing+Math.ceil(hits/2));s.xp+=hits*8;s.trainingCount++;note(s,'Passing drill: '+hits+'/5 successful passes.');if(s.stage===6){s.stage=7;note(s,'Gun: Are any of you playing again?');return true;}return false;}
function validSave(v){return v&&v.version===1&&maps[v.map]&&Number.isInteger(v.x)&&Number.isInteger(v.y)&&walkable(maps[v.map],v.x,v.y)&&Number.isInteger(v.stage)&&v.stage>=0&&v.stage<=7&&Array.isArray(v.met)&&v.met.every(x=>['Yukino','Kei','Hiyori'].includes(x))&&new Set(v.met).size===v.met.length&&Array.isArray(v.log)&&v.log.every(x=>typeof x==='string')&&v.rapport&&['Yukino','Kei','Hiyori'].every(x=>Number.isFinite(v.rapport[x]))&&['trust','passing','xp','trainingCount'].every(x=>Number.isFinite(v[x]))&&typeof v.joined==='boolean';}
const api={W,H,maps,hints,fresh,walkable,move,nearby,talk,finishTraining,validSave};
if(typeof module!=='undefined')module.exports=api;root.FourDirections=api;
})(typeof window!=='undefined'?window:globalThis);
