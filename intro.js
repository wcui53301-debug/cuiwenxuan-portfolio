(()=>{
const root=document.documentElement,button=document.querySelector('#intro-greeting');
const surfaces=[document.querySelector('.rail'),document.querySelector('#main')];
const preview=document.querySelector('#preview');
// Render the photograph as actual black ink dots instead of smooth grey pixels.
function thermalPrint(){
 const img=preview.querySelector('.portrait-small');if(!img||img.dataset.printing)return;
 img.dataset.printing='yes';
 const draw=()=>{if(!img.isConnected||!img.naturalWidth)return;
  const canvas=document.createElement('canvas');canvas.className='thermal-dots';canvas.setAttribute('aria-hidden','true');
  canvas.width=232;canvas.height=Math.round(232*img.naturalHeight/img.naturalWidth);
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
  // The sticker's exterior black backdrop is paper, not printed ink.
  if(img.dataset.paperBackground==='black'){
   const frame=ctx.getImageData(0,0,canvas.width,canvas.height),d=frame.data,w=canvas.width,h=canvas.height;
   const seen=new Uint8Array(w*h),queue=[];
   const add=(x,y)=>{if(x<0||y<0||x>=w||y>=h)return;const n=y*w+x,i=n*4;if(seen[n]||Math.max(d[i],d[i+1],d[i+2])>55)return;seen[n]=1;queue.push(n)};
   for(let x=0;x<w;x++){add(x,0);add(x,h-1)}for(let y=0;y<h;y++){add(0,y);add(w-1,y)}
   for(let k=0;k<queue.length;k++){const n=queue[k],x=n%w,y=Math.floor(n/w),i=n*4;d[i]=d[i+1]=d[i+2]=255;add(x-1,y);add(x+1,y);add(x,y-1);add(x,y+1)}
   ctx.putImageData(frame,0,0);
  }
  applyThermalInk(canvas);img.hidden=true;preview.append(canvas);
 };
 if(img.complete)draw();else img.addEventListener('load',draw,{once:true});
}
new MutationObserver(thermalPrint).observe(preview,{childList:true});thermalPrint();
if(!root.classList.contains('intro-pending')){button.hidden=true;return}
surfaces.forEach(el=>el.inert=true);button.focus({preventScroll:true});
let opened=false,finished=false,raf,canvas;
const paper=new Image();paper.src='assets/kraft-paper.png';const lettering=new Image();lettering.src='assets/hello-lettering.svg?v=ink2';
function finish(){
 if(finished)return;finished=true;
 cancelAnimationFrame(raf);canvas?.remove();button.hidden=true;root.classList.remove('intro-pending','paper-crumpling');surfaces.forEach(el=>el.inert=false);
 try{sessionStorage.setItem('cwx-paper-ball','yes')}catch(e){}
 window.activatePaperCursor?.(innerWidth/2,innerHeight/2);
 const title=document.querySelector('.bio h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true})}
 const u=new URL(location.href);if(u.searchParams.has('intro')){u.searchParams.delete('intro');history.replaceState(null,'',u.pathname+u.search+u.hash)}
}
function triangle(ctx,tex,s,d,shade){
 const [s0,s1,s2]=s,[d0,d1,d2]=d;
 const den=(s1.x-s0.x)*(s2.y-s0.y)-(s2.x-s0.x)*(s1.y-s0.y);
 const a=((d1.x-d0.x)*(s2.y-s0.y)-(d2.x-d0.x)*(s1.y-s0.y))/den;
 const c=((s1.x-s0.x)*(d2.x-d0.x)-(s2.x-s0.x)*(d1.x-d0.x))/den;
 const b=((d1.y-d0.y)*(s2.y-s0.y)-(d2.y-d0.y)*(s1.y-s0.y))/den;
 const f=((s1.x-s0.x)*(d2.y-d0.y)-(s2.x-s0.x)*(d1.y-d0.y))/den;
 ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();
 ctx.transform(a,b,c,f,d0.x-a*s0.x-c*s0.y,d0.y-b*s0.x-f*s0.y);ctx.drawImage(tex,0,0);ctx.restore();
 if(shade){ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.fillStyle=shade>0?`rgba(38,29,15,${shade})`:`rgba(255,246,218,${-shade})`;ctx.fill();ctx.restore()}
}
async function begin(){
 if(opened)return;opened=true;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
 await Promise.all([paper.decode().catch(()=>{}),lettering.decode().catch(()=>{}),document.fonts.ready]);
 if(finished)return;
 if(!paper.naturalWidth){finish();return}
 canvas=document.createElement('canvas');canvas.className='crumple-canvas';canvas.setAttribute('aria-hidden','true');canvas.width=innerWidth;canvas.height=innerHeight;document.body.append(canvas);
 const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
 const tex=document.createElement('canvas');tex.width=W;tex.height=H;const t=tex.getContext('2d');
 // Use the unlettered upper portion of the supplied paper reference.
 const sh=paper.naturalHeight*.82,scale=Math.max(W/paper.naturalWidth,H/sh),sw=W/scale,sy=H/scale;
 t.drawImage(paper,(paper.naturalWidth-sw)/2,0,sw,sy,0,0,W,H);
 t.fillStyle='rgba(255,255,255,.5)';t.fillRect(0,0,W,H);
 t.textAlign='center';t.textBaseline='middle';
 for(const el of button.querySelectorAll('.intro-hello,.intro-invitation')){const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(el.classList.contains('intro-hello')&&lettering.naturalWidth){t.drawImage(lettering,r.left,r.top,r.width,r.height);continue;}t.fillStyle=cs.color;t.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;t.letterSpacing=cs.letterSpacing;t.fillText(el.textContent,r.left+r.width/2,r.top+r.height/2)}

 button.hidden=true;root.classList.remove('intro-pending');root.classList.add('paper-crumpling');
 const nx=12,ny=12,start=performance.now(),duration=2100;
 function frame(now){
 const u=Math.min((now-start)/duration,1),ease=u*u*(3-2*u),fold=Math.sin(Math.PI*u)*.8+u*.2;
 ctx.clearRect(0,0,W,H);
 const sx=(1-ease)*(1-ease)+28/W*ease,sy=(1-ease)**1.5+28/H*ease,angle=Math.sin(u*3.4)*.2+u*2.4;
 const points=[];
 for(let j=0;j<=ny;j++){points[j]=[];for(let i=0;i<=nx;i++){
 let x=(i/nx-.5)*W,y=(j/ny-.5)*H;
 const wave=Math.sin(i*2.1+j*1.3+u*4),wave2=Math.cos(j*2.4-i*.9+u*3);
 x=(x+wave*W*.075*fold)*sx;y=(y+wave2*H*.075*fold)*sy;
 points[j][i]={x:W/2+x*Math.cos(angle)-y*Math.sin(angle),y:H/2+x*Math.sin(angle)+y*Math.cos(angle)};
 }}
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
 const s0={x:i*W/nx,y:j*H/ny},s1={x:(i+1)*W/nx,y:j*H/ny},s2={x:i*W/nx,y:(j+1)*H/ny},s3={x:(i+1)*W/nx,y:(j+1)*H/ny};
 const shade=Math.sin(i*2.1+j*1.7)*.2*fold;
 triangle(ctx,tex,[s0,s1,s2],[points[j][i],points[j][i+1],points[j+1][i]],shade);
 triangle(ctx,tex,[s1,s3,s2],[points[j][i+1],points[j+1][i+1],points[j+1][i]],-shade*.8);
 }
 if(u<1)raf=requestAnimationFrame(frame);else finish();
 }
 raf=requestAnimationFrame(frame);
}
button.addEventListener('click',begin);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(opened||root.classList.contains('intro-pending'))){opened=true;finish()}});
})();
