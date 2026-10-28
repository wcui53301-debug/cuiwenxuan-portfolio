window.applyThermalInk=function(canvas){const ctx=canvas.getContext("2d",{willReadFrequently:true});
  const frame=ctx.getImageData(0,0,canvas.width,canvas.height),d=frame.data;
  const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
   const i=(y*canvas.width+x)*4;let lum=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)/255;
   lum=Math.min(1,Math.max(0,(lum-.07)/.91));
   const speck=((x*73+y*139)%997)/997;
   const dropout=(y%71===0&&x%13<8)||speck>.989;
   const ink=lum<(bayer[(y%4)*4+x%4]+.5)/16&&!dropout;
   d[i]=d[i+1]=d[i+2]=ink?35:255;d[i+3]=255;
  }
  ctx.putImageData(frame,0,0);
};
