(()=>{
 const ball=document.createElement('div');ball.className='paper-ball';ball.setAttribute('aria-hidden','true');document.body.append(ball);
 let active=false,tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty,raf=0;
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function tick(){x+=(tx-x)*.2;y+=(ty-y)*.2;ball.style.transform=`translate3d(${x}px,${y}px,0) rotate(${x*.13}deg)`;if(Math.abs(tx-x)+Math.abs(ty-y)>.25)raf=requestAnimationFrame(tick);else raf=0}
 window.activatePaperCursor=(cx,cy)=>{if(!fine.matches||reduced.matches)return;active=true;x=cx??tx;y=cy??ty;ball.classList.add('visible');if(!raf)raf=requestAnimationFrame(tick)};
 document.addEventListener('pointermove',e=>{tx=e.clientX+15;ty=e.clientY+18;if(active){ball.classList.add('visible');if(!raf)raf=requestAnimationFrame(tick)}});
 document.addEventListener('pointerout',e=>{if(!e.relatedTarget)ball.classList.remove('visible')});
 document.addEventListener('pointerdown',()=>ball.classList.add('pressed'));document.addEventListener('pointerup',()=>ball.classList.remove('pressed'));
 try{if(sessionStorage.getItem('cwx-paper-ball')==='yes'&&!document.documentElement.classList.contains('intro-pending'))window.activatePaperCursor()}catch(e){}
})();
