'use strict';
const E=FourDirections,T=24,c=document.getElementById('game'),g=c.getContext('2d');
g.imageSmoothingEnabled=false;
let state=E.fresh(),dialog=null,di=0,drill=null,keys=new Set(),lastMove=0,toast='',toastUntil=0;
const $=id=>document.getElementById(id);
const portraits={};
const bedroomArt=new Image();bedroomArt.src='../art/Hachiman_Bedroom.jpg';
for(const name of ['Hachiman','Kaito','Yukino','Kei','Hiyori']){const im=new Image();im.src='../art/'+name+'_Expressions.jpg';portraits[name]=im;}
const palettes={wood:['#ba9270','#ac8262','#534f5b'],tile:['#ded5b4','#d3c9a5','#666d73'],town:['#bcc4a0','#b0b990','#597448'],garden:['#b8c09a','#aeb68c','#6b7f50'],grass:['#51915b','#4a8755','#3c714a']};
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);}
function text(s,x,y,color='#ffffff',size=9){g.fillStyle=color;g.font=size+'px monospace';g.fillText(s,x,y);}
function sprite(x,y,name,walking=false){
 const px=x*T+5,py=y*T-2;const female=['Yukino','Kei','Hiyori'].includes(name);
 const hair={Hachiman:'#283653',Kaito:'#654024',Yukino:'#242735',Kei:'#dcb064',Hiyori:'#bdafcd',Hiratsuka:'#39333f',Captain:'#563f30'}[name]||'#493e30';
 const step=walking?Math.floor(performance.now()/140)%2:0;
 rect(px,py+23,16,3,'#00000026');
 if(female)rect(px-1,py+4,16,17,hair);
 rect(px+1,py+1,12,12,hair);rect(px-1,py+4,16,5,hair);rect(px+3,py+6,8,8,'#edc29b');
 rect(px+1,py+2,9,6,hair);rect(px+10,py+3,3,7,hair);
 rect(px+4,py+9,2,2,'#314152');rect(px+9,py+9,2,2,'#314152');
 rect(px+2,py+14,11,9,'#202a3b');rect(px+6,py+14,3,7,'#eee9da');rect(px+3,py+15,1,6,'#b9c5c6');rect(px+11,py+15,1,6,'#b9c5c6');
 if(female){rect(px+6,py+15,4,2,'#a65253');rect(px+1,py+21,13,3,'#384151');}
 rect(px,py+16,2,5,'#202a3b');rect(px+13,py+16,2,5,'#202a3b');rect(px,py+21,2,2,'#edc29b');rect(px+13,py+21,2,2,'#edc29b');
 rect(px+3,py+23,4,4+step,'#222e40');rect(px+9,py+23,4,5-step,'#222e40');
 rect(px+2,py+26+step,5,2,'#141d29');rect(px+9,py+27-step,5,2,'#141d29');
}
function draw(){
 const m=E.maps[state.map],pal=palettes[m.type];g.clearRect(0,0,c.width,c.height);
 const illustrated=m.id==='bedroom'&&bedroomArt.complete&&bedroomArt.naturalWidth>0;
 if(illustrated)g.drawImage(bedroomArt,0,0,c.width,c.height);
 if(!illustrated){
 for(let y=0;y<E.H;y++)for(let x=0;x<E.W;x++){
  const a=x*T,b=y*T,t=m.grid[y][x];rect(a,b,T,T,pal[(x+y)%2]);
  if(m.type==='wood'){rect(a,b+22,T,1,'#9d745758');rect(a+((y%2)*10),b,1,22,'#9d745758');}
  else if(['town','garden','grass'].includes(m.type)){rect(a+3+(x*7+y)%16,b+5,2,2,'#6a975058');rect(a+15,b+18,3,1,'#355a3c30');}
  else{rect(a,b,T,1,'#b7b79b');rect(a,b,1,T,'#b7b79b');}
  if(t==='#'){rect(a,b,T,T,['town','garden','grass'].includes(m.type)?'#375344':pal[2]);rect(a+2,b+2,20,3,'#889081');rect(a+2,b+13,20,2,'#293d3744');}
  if(t==='B'){
   const top=y===0||m.grid[y-1][x]!=='B';rect(a,b,T,T,top?'#394c5b':'#e5e1c9');rect(a,b+22,T,2,'#929b93');
   if(top){rect(a,b+4,T,2,'#697b82');rect(a,b+14,T,2,'#697b82');}
   else{rect(a+5,b+4,14,14,'#476c80');rect(a+7,b+5,4,12,'#83b2c4');rect(a+12,b+4,1,14,'#e9e2c6');rect(a+5,b+10,14,1,'#e9e2c6');}
  }
  if(t==='F'){rect(a+2,b+4,20,18,'#544d4d');rect(a+1,b+1,22,17,'#9c7550');rect(a+3,b+3,18,3,'#c29a69');rect(a+5,b+8,13,1,'#715d4d');}
  if(t==='T'){rect(a+10,b+11,5,13,'#795a41');rect(a+2,b+2,20,17,'#456e47');rect(a+4,b,16,16,'#dc9cad');rect(a+2,b+5,20,7,'#ecb4bc');rect(a+8,b+3,3,3,'#ffd4d2');}
 }
 }
 if(m.type==='grass'){
  g.strokeStyle='#d1e2bc';g.lineWidth=2;g.strokeRect(45,48,483,239);g.beginPath();g.moveTo(286,48);g.lineTo(286,287);g.stroke();
  g.beginPath();g.arc(286,168,37,0,Math.PI*2);g.stroke();g.strokeRect(45,118,63,99);g.strokeRect(465,118,63,99);g.strokeRect(31,140,14,55);g.strokeRect(528,140,14,55);
 }
 for(const p of m.portals){if(illustrated){rect(p.x*T+3,p.y*T+12,18,2,'#e8c982');continue;}rect(p.x*T+1,p.y*T+1,22,22,'#d9b86b');rect(p.x*T+6,p.y*T+7,12,3,'#5b6454');rect(p.x*T+10,p.y*T+4,4,12,'#5b6454');text(p.label,Math.min(440,Math.max(8,p.x*T-18)),Math.max(12,p.y*T-5),'#172d37',9);}
 if(!illustrated)for(const o of m.objects){rect(o.x*T+5,o.y*T+5,14,10,o.kind==='training'?'#f5eee0':'#d5bf86');text(o.kind==='training'?'o':'?',o.x*T+8,o.y*T+14,'#32465b',9);}
 const actors=[...m.npcs,{x:state.x,y:state.y,name:'Hachiman',player:true}].sort((a,b)=>a.y-b.y);
 for(const n of actors){sprite(n.x,n.y,n.name,n.player&&keys.size>0&&!dialog&&!drill);if(!n.player)text(n.name,n.x*T-5,n.y*T-7,'#172d37');}
 const n=E.nearby(state);if(n&&!dialog&&!drill){rect(7,353,Math.min(560,(n.name||n.label).length*7+112),24,'#142b3bdc');text('E · '+(n.name||n.label),16,369,'#f4d698',12);}
 if(drill){
  rect(24,99,528,154,'#142839');text('PASSING DRILL · '+(drill.attempt+1)+'/5',48,130,'#ebc87c',18);
  rect(48,157,480,25,'#53706c');rect(48+480*.43,157,480*.18,25,'#ddb969');
  const v=drillPosition();rect(48+480*v-3,151,6,37,'#ffffff');text('Space / tap to pass in the gold zone',48,217,'#e9eddc',13);text('Successful passes: '+drill.hits,48,237,'#a9d8bb',11);
 }
 $('place').textContent=m.name;$('stats').textContent='DAY 1 · LV '+(1+Math.floor(state.xp/100))+' · PASS '+state.passing;
 $('hint').textContent=performance.now()<toastUntil?toast:'Next: '+E.hints[state.stage];requestAnimationFrame(draw);
}
function notify(s){toast=s;toastUntil=performance.now()+4000;}
function show(d){dialog=d;di=0;keys.clear();$('dialog').style.display='block';renderDialog();}
function renderDialog(){
 $('speaker').textContent=dialog.speaker;$('line').textContent=dialog.lines[di];$('choices').replaceChildren();$('advance').hidden=false;
 const pc=$('portrait').getContext('2d');pc.clearRect(0,0,70,83);const im=portraits[dialog.speaker];$('portrait').hidden=!im||!im.complete||!im.naturalWidth;
 if(im&&im.complete&&im.naturalWidth)pc.drawImage(im,10,74,294,340,0,0,70,83);
 if(di===dialog.lines.length-1&&dialog.choices){$('advance').hidden=true;for(const [label,action]of dialog.choices){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{action();close();};$('choices').appendChild(b);}}
}
function close(){dialog=null;$('dialog').style.display='none';c.focus();}
function advance(){if(!dialog)return;if(di<dialog.lines.length-1){di++;renderDialog();}else if(!dialog.choices){const training=dialog.training;close();if(training)drill={start:performance.now(),attempt:0,hits:0};}}
function drillPosition(){return (Math.sin((performance.now()-drill.start)/650)+1)/2;}
function interact(){if(drill){const v=drillPosition();if(v>=.43&&v<=.61)drill.hits++;drill.attempt++;if(drill.attempt>=5){const hits=drill.hits;drill=null;const ending=E.finishTraining(state,hits);show({speaker:ending?'Hachiman':'Kaito',lines:ending?['Five passes. We found a little of the old rhythm.','Kaito: Still planning your simple life?','Hachiman: More carefully than ever.','My phone vibrates. The old group chat has a new message.','Gun: Are any of you playing again?','Episode 1 complete. You can explore freely, train again, and save.']:['Drill complete: '+hits+'/5. Passing is now '+state.passing+'.']});}else drill.start=performance.now();return;}if(dialog){advance();return;}const n=E.nearby(state);if(n)show(E.talk(state,n));else notify('Stand next to a person or an object, then press E.');}
function step(dx,dy){if(dialog||drill)return;E.move(state,dx,dy);}
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='Escape'){if(dialog&&!dialog.choices)close();$('journal').style.display='none';return;}if(['e','E','Enter',' '].includes(e.key)&&!e.repeat){interact();return;}keys.add(e.key.toLowerCase());});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>keys.clear());
function update(t){if(t-lastMove>(keys.has('shift')?75:135)){let d=null;if(keys.has('arrowup')||keys.has('w'))d=[0,-1];else if(keys.has('arrowdown')||keys.has('s'))d=[0,1];else if(keys.has('arrowleft')||keys.has('a'))d=[-1,0];else if(keys.has('arrowright')||keys.has('d'))d=[1,0];if(d){step(...d);lastMove=t;}}requestAnimationFrame(update);}
for(const b of document.querySelectorAll('[data-dir]')){let repeat;b.addEventListener('pointerdown',e=>{e.preventDefault();const d=b.dataset.dir.split(',').map(Number);step(...d);repeat=setInterval(()=>step(...d),135);b.setPointerCapture(e.pointerId);});const stop=()=>clearInterval(repeat);b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);}
$('advance').onclick=advance;$('interact').onclick=interact;$('touchAction').onclick=interact;
$('save').onclick=()=>{try{localStorage.setItem('four-directions-pixel-v1',JSON.stringify(state));notify('Saved in this browser.');}catch{notify('Browser storage unavailable. Save could not be written.');}};
$('load').onclick=()=>{try{const v=JSON.parse(localStorage.getItem('four-directions-pixel-v1'));if(!E.validSave(v))throw Error('invalid');state=v;close();drill=null;notify('Saved game loaded.');}catch{notify('No valid save found in this browser.');}};
$('reset').onclick=()=>{if(confirm('Start a new game? Your stored save stays available until you save again.')){state=E.fresh();close();drill=null;notify('A new first day begins.');}};
$('journalButton').onclick=()=>{const j=$('journal');j.style.display=j.style.display==='block'?'none':'block';$('journalContent').replaceChildren();const p=document.createElement('p');p.textContent='Kaito trust '+state.trust+' · Yukino '+state.rapport.Yukino+' · Kei '+state.rapport.Kei+' · Hiyori '+state.rapport.Hiyori+' · XP '+state.xp;$('journalContent').appendChild(p);const ol=document.createElement('ol');for(const line of state.log){const li=document.createElement('li');li.textContent=line;ol.appendChild(li);}$('journalContent').appendChild(ol);};
draw();requestAnimationFrame(update);c.focus();
