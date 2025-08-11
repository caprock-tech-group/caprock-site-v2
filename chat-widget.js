(function(){
  const css = `
  .caprock-chat-btn{position:fixed;right:20px;bottom:20px;z-index:9999;border:none;border-radius:9999px;padding:12px 16px;font-weight:700;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.35);background:linear-gradient(90deg,#0E2A47,#1F7A8C);color:#fff}
  .caprock-chat-panel{position:fixed;right:20px;bottom:80px;width:360px;max-height:70vh;background:#0b1220;border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.45);display:none;flex-direction:column;overflow:hidden;z-index:9999;border:1px solid rgba(255,255,255,.08)}
  .caprock-chat-header{padding:12px 14px;font-weight:800;background:#000814;color:#fff;border-bottom:1px solid rgba(255,255,255,.06)}
  .caprock-chat-body{padding:12px;overflow:auto;gap:8px;display:flex;flex-direction:column;background:linear-gradient(180deg, rgba(31,122,140,.12), transparent)}
  .caprock-msg{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06);color:#e5e7eb;word-break:break-word;border:1px solid rgba(255,255,255,.08)}
  .caprock-msg.me{background:rgba(212,199,108,.18);color:#fff3b0;align-self:flex-end;border-color:rgba(212,199,108,.35)}
  .caprock-chat-input{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.06);background:#0b1220}
  .caprock-chat-input input{flex:1;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:#e5e7eb}
  .caprock-chat-input button{padding:10px 14px;border-radius:10px;border:none;font-weight:700;cursor:pointer;background:linear-gradient(90deg,#0E2A47,#1F7A8C);color:#fff}
  `;
  const style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);

  const btn=document.createElement('button'); btn.className='caprock-chat-btn'; btn.textContent='Chat with us';
  const panel=document.createElement('div'); panel.className='caprock-chat-panel'; panel.id='caprockChat';
  panel.innerHTML=`
    <div class="caprock-chat-header">Caprock Assistant</div>
    <div class="caprock-chat-body" id="caprockBody"></div>
    <div class="caprock-chat-input">
      <input id="caprockInput" type="text" placeholder="Type your message..." />
      <button id="caprockSend">Send</button>
    </div>`;
  document.addEventListener('DOMContentLoaded', ()=>{ document.body.appendChild(btn); document.body.appendChild(panel); });

  const body=panel.querySelector('#caprockBody');
  const input=panel.querySelector('#caprockInput');
  const send=panel.querySelector('#caprockSend');

  function addMsg(t,me=false){const d=document.createElement('div'); d.className='caprock-msg'+(me?' me':''); d.textContent=t; body.appendChild(d); body.scrollTop=body.scrollHeight;}

  btn.addEventListener('click',()=>{panel.style.display=panel.style.display==='flex'?'none':'flex'; panel.style.flexDirection='column'; if(!body.childElementCount) addMsg("Hey! I’m your Caprock assistant—how can I help today?");});

  async function sendMsg(){
    const t=(input.value||'').trim(); if(!t) return; addMsg(t,true); input.value=''; addMsg('Thinking...');
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:t})});
      const data=await r.json(); body.lastChild.textContent=data.response||'Sorry, no response.';
    }catch(e){ body.lastChild.textContent='Error contacting support. Please try again.'; }
  }
  send.addEventListener('click',sendMsg);
  input.addEventListener('keydown',e=>{ if(e.key==='Enter') sendMsg(); });
})();