"""Four Directions: playable story prototype. Python 3 + Pillow."""
import json, random, math, tkinter as tk
from pathlib import Path
from tkinter import messagebox, filedialog
from PIL import Image, ImageTk
ROOT = Path(__file__).resolve().parent
SCHOOLS = {
 'South': ('Minami Seiryu', 'Kagoshima', 'Hachiman / Kaito', 'Yukino / Kei / Hiyori', '#20242c'),
 'North': ('Hokusei', 'Sapporo', 'Gun / Makishima', 'Yui / Suzune / Hina', '#275d48'),
 'East': ('Toto Academy', 'Tokyo', 'Ayanokoji / Jin Tadokoro', 'Iroha / Honami / Yumiko', '#9b3545'),
 'West': ('Seiran', 'Kyoto', 'Isagi / Midosuji', 'Arisu / Kikyo / Saki', '#355eac')}
def fresh():
 return dict(day=1, chapter=0, passing=60, control=60, vision=60, stamina=100, xp=0,
             trust=0, relationships={'Yukino':0,'Kei':0,'Hiyori':0}, styles=[], events=[], results=[])
class Match:
 """Simplified possession engine. Animation depicts resolved actions, not full football physics."""
 def __init__(self, state, opponent, seed):
  self.rng=random.Random(seed); self.state=state; self.opponent=opponent
  self.minute=0; self.score=[0,0]; self.shots=[0,0]; self.passes=[0,0]; self.possession=[0,0]
  self.subs=[0,0]; self.bench=[[12,13,14,15,16,17,18],[12,13,14,15,16,17,18]]
  self.numbers=[list(range(1,12)),list(range(1,12))]; self.log=[]; self.last='Kick-off'
  self.side=0; self.carrier=8; self.ball=(.5,.5)
 def step(self):
  if self.minute>=90:return
  self.minute+=1; r=self.rng; self.side=r.randrange(2); t=self.side
  self.possession[t]+=1; self.carrier=r.randrange(1,11)
  self.ball=(r.uniform(.15,.85),r.uniform(.15,.85))
  skill=(self.state['passing']+self.state['vision'])/2 if t==0 else 68
  skill*=.65+.35*self.state['stamina']/100 if t==0 else 1
  if r.random()<.24:
   self.shots[t]+=1
   if r.random()<min(.42,.12+skill/420):
    self.score[t]+=1; self.last=f"{self.minute}' GOAL — {'South' if t==0 else self.opponent} #{self.numbers[t][self.carrier]}"
   else:self.last=f"{self.minute}' Shot saved / wide"
  else:
   self.passes[t]+=1; self.last=f"{self.minute}' {'South' if t==0 else self.opponent} builds through midfield"
  self.log.append(self.last)
 def substitute(self,t,index):
  if self.subs[t]>=5 or not self.bench[t] or self.minute>=90:return False
  old=self.numbers[t][index]; new=self.bench[t].pop(0); self.numbers[t][index]=new; self.subs[t]+=1
  self.last=f"{self.minute}' Substitution: #{old} off, #{new} on"; self.log.append(self.last); return True
class Game:
 def __init__(self):
  self.s=fresh(); self.match=None; self.running=False; self.token=0
  self.root=tk.Tk(); self.root.title('Four Directions — Football Story'); self.root.geometry('1200x850'); self.root.configure(bg='#111724')
  self.top=tk.Frame(self.root,bg='#111724'); self.top.pack(fill='x')
  for name,fn in [('Story',self.story),('Training',self.training),('Relationships',self.relationships),('Schools',self.schools),('Match',self.match_menu),('Save',self.save),('Load',self.load)]:
   tk.Button(self.top,text=name,command=fn,bg='#263448',fg='white',padx=12,pady=9).pack(side='left',padx=3,pady=8)
  self.status=tk.Label(self.root,bg='#111724',fg='#91d9b7'); self.status.pack()
  self.body=tk.Frame(self.root,bg='#182234'); self.body.pack(fill='both',expand=True,padx=16,pady=12)
  self.story(); self.root.mainloop()
 def clear(self,title):
  self.running=False; self.token+=1
  for w in self.body.winfo_children():w.destroy()
  self.status.config(text=f"Day {self.s['day']} • Level {1+self.s['xp']//100} • Passing {self.s['passing']} • Control {self.s['control']} • Vision {self.s['vision']} • Stamina {self.s['stamina']} • Kaito trust {self.s['trust']}")
  tk.Label(self.body,text=title,font=('Arial',22,'bold'),bg='#182234',fg='white').pack(pady=9)
 def text(self,t):tk.Label(self.body,text=t,wraplength=1040,justify='left',font=('Arial',13),bg='#182234',fg='#e0e7f2').pack(padx=20,pady=8)
 def button(self,t,fn):tk.Button(self.body,text=t,command=fn,bg='#30445c',fg='white',font=('Arial',12),padx=15,pady=7).pack(pady=4)
 def picture(self,name):
  im=Image.open(ROOT/'assets'/f'{name}.jpg'); im.thumbnail((1000,430)); self.photo=ImageTk.PhotoImage(im)
  tk.Label(self.body,image=self.photo,bg='#182234').pack(pady=5)
 def story(self):
  c=self.s['chapter']; self.clear('Chapter One — The Ball Returns'); self.picture('South')
  scenes=[
   ('First year of middle school. Gun lifts the national trophy. Hachiman, Kaito, Ayanokoji, Isagi and Makishima stand beside him. They were equals. After that victory, all six stopped playing. Why remains unresolved.', [('Begin the first day at Minami Seiryu',{})]),
   ('Kagoshima. A stray football rolls toward Hachiman outside his new school. Across the pitch stands a familiar boy: Kaito.', [('Send a precise pass to Kaito',{'passing':2,'trust':2}),('Stop the ball and ask why he is here',{'vision':2,'trust':1})]),
   ('Kaito smiles. "You still pass like that." The school captain invites both of you to practice. Neither of you has played since the championship.', [('Agree to practice together',{'trust':3,'xp':20}),('Watch the team first, then join',{'vision':3,'xp':20})]),
   ('In class, Yukino asks about the football club. Kei wants to see the next match. Hiyori quietly offers to help you keep a training journal.', [('Speak honestly about returning',{'trust':1}),('Say you want to take it slowly',{'control':1})]),
   ('Kaito: "Are we going to pretend football never happened?" You decide to return one training session at a time. Your former teammates are now at schools across Japan.', [('Make a promise to train together',{'trust':3,'xp':25})])]
  if c<len(scenes):
   t,choices=scenes[c]; self.text(t)
   for label,effects in choices:self.button(label,lambda e=effects:self.choice(e))
  else:
   self.text('Chapter One complete. Train, spend time with classmates, and challenge the three rival schools. This prototype leaves the reason for the football break and later chapters open.')
   self.button('Begin a training session',self.training)
 def choice(self,effects):
  for k,v in effects.items():self.s[k]=min(100,self.s[k]+v) if k in ('passing','vision','control') else self.s[k]+v
  self.s['chapter']+=1; self.story()
 def training(self):
  self.clear('Training — Earn Your Style'); self.picture('South_kit')
  self.text('Training costs 15 stamina and advances a day. Style Echo is learned through practice: watching a player alone does not grant mastery.')
  for label,key in [('Xavi: passing triangles','passing'),('Modric: turn out of pressure','control'),('Study movement and passing lanes','vision')]:self.button(label,lambda k=key:self.drill(k))
  self.button('Rest: recover 35 stamina',self.rest)
  self.text('Unlocked: '+(', '.join(self.s['styles']) or 'None yet'))
 def drill(self,key):
  if self.s['stamina']<15:messagebox.showinfo('Recovery','Rest before training.');return
  self.s[key]=min(100,self.s[key]+3); self.s['stamina']-=15; self.s['xp']+=25; self.s['day']+=1
  for skill,threshold,style in [('passing',69,'Xavi — Tempo Control'),('control',69,'Modric — Pressure Escape'),('vision',69,'Kroos — Switch of Play')]:
   if self.s[skill]>=threshold and style not in self.s['styles']:self.s['styles'].append(style)
  self.training()
 def rest(self):self.s['stamina']=min(100,self.s['stamina']+35); self.s['day']+=1; self.training()
 def relationships(self):
  self.clear('Relationships — Choose Your Time'); self.picture('South')
  for name,n in self.s['relationships'].items():
   self.text(f'{name}: {n} connection points • '+('Growing affection' if n>=15 else 'Getting to know each other'))
   self.button({'Yukino':'Discuss your goals with Yukino','Kei':'Walk home with Kei','Hiyori':'Read your training journal with Hiyori'}[name],lambda who=name:self.visit(who))
 def visit(self,name):
  self.clear('An afternoon with '+name)
  self.text({'Yukino':'"Winning again is a goal. What makes you want to play?"','Kei':'"You looked happy when Kaito passed to you. Will you play tomorrow?"','Hiyori':'"There is more in this journal than numbers. You noticed everyone’s movement."'}[name])
  self.button('Share your feelings honestly (+3 connection)',lambda:self.bond(name,3))
  self.button('Listen and ask about her day (+2 connection)',lambda:self.bond(name,2))
 def bond(self,name,n):self.s['relationships'][name]+=n; self.s['day']+=1; self.s['events'].append(f"Day {self.s['day']}: spent time with {name}"); self.relationships()
 def schools(self):
  self.clear('Four Schools • One Shared Past')
  for region,(school,city,boys,girls,color) in SCHOOLS.items():self.button(f'{region} — {school} / {city}',lambda r=region:self.school(r))
 def school(self,r):
  school,city,boys,girls,color=SCHOOLS[r]; self.clear(f'{r} — {school}'); self.picture(r)
  self.text(f'{city}\nPlayers: {boys}\nClassmates: {girls}')
  self.text({'South':'Hachiman: CM/CAM/CDM, Xavi + Modric. Kaito: CAM/LW/CF, joker movement and Kroos passing.','North':'Gun: centre-back inspired by Maldini; former middle-school captain. Makishima: CAM inspired by Muller.','East':'Ayanokoji: CM inspired by Zidane. Jin Tadokoro: striker inspired by Lukaku.','West':'Isagi: CAM inspired by Neymar. Midosuji: striker inspired by Peter Crouch; headers and aerial play.'}[r])
  self.button('View football kit',lambda:self.kit(r))
 def kit(self,r):self.clear(r+' — Football Kit'); self.picture(r+'_kit'); self.button('Back to school',lambda:self.school(r))
 def match_menu(self):
  self.clear('Practice Match • 11 versus 11')
  self.text('Simplified prototype: possession events and an animated tactical view. Only the two named players per team have story identities; the other nine and bench players use shirt numbers. Full fouls, offside and tactical AI are future work.')
  for r in ('North','East','West'):self.button('South vs '+r,lambda opponent=r:self.start_match(opponent))
 def start_match(self,r):
  self.clear('South vs '+r); self.match=Match(self.s.copy(),r,self.s['day']); self.recorded=False
  self.info=tk.Label(self.body,text='',font=('Arial',16),bg='#182234',fg='white'); self.info.pack()
  self.canvas=tk.Canvas(self.body,width=940,height=430,bg='#216847',highlightthickness=0); self.canvas.pack()
  controls=tk.Frame(self.body,bg='#182234'); controls.pack()
  for t,fn in [('Play / Pause',self.toggle),('Step minute',self.step),('Sub South #9 slot',lambda:self.sub(0)),('Sub opponent #9 slot',lambda:self.sub(1)),('Export timeline',self.export)]:tk.Button(controls,text=t,command=fn).pack(side='left',padx=4,pady=10)
  self.speed=tk.DoubleVar(value=1); tk.Scale(controls,from_=1,to=5,resolution=1,orient='horizontal',variable=self.speed,label='Speed').pack(side='left')
  self.comment=tk.Label(self.body,text='Kick-off',bg='#182234',fg='white');self.comment.pack();self.draw()
 def toggle(self):
  self.running=not self.running
  if self.running:self.tick(self.token)
 def tick(self,token):
  if token!=self.token or not self.running:return
  self.step()
  if self.match.minute<90:self.root.after(int(650/self.speed.get()),lambda:self.tick(token))
  else:self.running=False
 def step(self):
  m=self.match
  if not m or m.minute>=90:return
  m.step(); self.draw()
  if m.minute==90 and not self.recorded:
   self.recorded=True; self.s['xp']+=50; self.s['day']+=1;self.s['stamina']=max(0,self.s['stamina']-25)
   self.s['results'].append({'opponent':m.opponent,'score':m.score[:],'log':m.log[:]})
   messagebox.showinfo('Full time',f'South {m.score[0]} — {m.score[1]} {m.opponent}\n+50 XP. Timeline available to export.')
 def sub(self,t):
  if self.match.substitute(t,8):self.draw()
  else:messagebox.showinfo('Substitutions','Five substitutions allowed per team; no substitutions after full time.')
 def draw(self):
  m=self.match;c=self.canvas;c.delete('all'); x0,y0,w,h=30,25,880,380
  c.create_rectangle(x0,y0,x0+w,y0+h,outline='white');c.create_line(470,y0,470,y0+h,fill='white');c.create_oval(405,150,535,280,outline='white')
  for x in (30,790):c.create_rectangle(x,130,x+120,300,outline='white')
  for t in (0,1):
   for i,num in enumerate(m.numbers[t]):
    if i==0:x,y=(.04,.5)
    else:
     line=(i-1)//4;col=(i-1)%4; x=.20+line*.20;y=.17+col*.21
     x+=.025*math.sin(m.minute*.6+i);y+=.025*math.cos(m.minute*.4+i)
    if t:x=1-x
    px,py=x0+x*w,y0+y*h;color='#eee' if t==0 else SCHOOLS[m.opponent][4]
    c.create_oval(px-13,py-13,px+13,py+13,fill=color,outline='#101826');c.create_text(px,py,text=str(num),fill='#111' if t==0 else 'white')
  bx,by=m.ball;c.create_oval(x0+bx*w-5,y0+by*h-5,x0+bx*w+5,y0+by*h+5,fill='yellow')
  total=max(1,sum(m.possession));self.info.config(text=f"{m.minute}'  SOUTH {m.score[0]} : {m.score[1]} {m.opponent.upper()}   Shots {m.shots}   Possession {round(100*m.possession[0]/total)}% / {round(100*m.possession[1]/total)}%")
  self.comment.config(text=m.last+f' • Bench South {m.bench[0]} / {m.opponent} {m.bench[1]}')
 def export(self):
  p=filedialog.asksaveasfilename(defaultextension='.txt',initialfile='match_timeline.txt')
  if p:Path(p).write_text('\n'.join(self.match.log),encoding='utf8')
 def save(self):
  p=filedialog.asksaveasfilename(defaultextension='.json',initialfile='story_save.json')
  if p:Path(p).write_text(json.dumps(self.s,indent=2),encoding='utf8');messagebox.showinfo('Saved','Story progress saved. Live matches are not saved; completed results are included.')
 def load(self):
  p=filedialog.askopenfilename(filetypes=[('Story save','*.json')])
  if not p:return
  try:
   data=json.loads(Path(p).read_text(encoding='utf8'));base=fresh()
   if set(data)!=set(base):raise ValueError('Not a compatible save')
   for k in ('day','chapter','passing','control','vision','stamina','xp','trust'):
    if not isinstance(data[k],int) or data[k]<0:raise ValueError('Invalid values')
   if set(data['relationships'])!=set(base['relationships']):raise ValueError('Invalid relationships')
   for k in ('styles','events','results'):
    if not isinstance(data[k],list):raise ValueError('Invalid lists')
   if any(not isinstance(v,int) or v<0 for v in data['relationships'].values()):raise ValueError('Invalid relationship values')
   self.s=data;self.story()
  except (ValueError,OSError,TypeError):messagebox.showerror('Load failed','Please select a valid game save.')
if __name__=='__main__':Game()
