window.drawReceiptBook=function(target,src,title,key){
 target.dataset.issue=key;target.replaceChildren();
 const img=new Image();img.onload=async()=>{
  await document.fonts.load('35px "Source Han Serif SC"');
  if(target.dataset.issue!==key)return;
  const canvas=document.createElement('canvas');canvas.width=232;canvas.height=342;canvas.className='thermal-dots';canvas.setAttribute('aria-hidden','true');
  const c=canvas.getContext('2d',{willReadFrequently:true});c.fillStyle='#f5f4ef';c.fillRect(0,0,232,342);
  c.save();c.translate(18,18);c.rotate(-.035);c.fillStyle='#999';c.fillRect(5,5,196,298);c.fillStyle='#e9e5d9';c.fillRect(0,0,196,295);c.fillStyle={content:'#179fa8',brand:'#9f303f',observe:'#527c63'}[key];c.fillRect(13,0,183,289);
  const scale=Math.max(183/img.naturalWidth,218/img.naturalHeight),sw=183/scale,sh=218/scale;
  c.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,13,60,183,218);
  c.fillStyle='#fff';c.font='8px "Source Han Serif SC",serif';c.fillText('CUI WENXUAN / VOL.0'+({content:1,brand:2,observe:3}[key]),21,17);
  c.font='bold 35px "Source Han Serif SC",serif';c.fillText(title[0],20,53);c.fillText(title[1],39,91);
  c.restore();applyThermalInk(canvas);target.replaceChildren(canvas);
 };img.alt='';img.src=src;
};
