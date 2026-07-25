const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}const buildDevisMessage=()=>{const nom=document.getElementById('nom')?.value.trim()||'';const tel=document.getElementById('tel')?.value.trim()||'';const service=document.getElementById('service')?.value||'';const msg=document.getElementById('message')?.value.trim()||'';return `Bonjour, je souhaite demander un devis.
Nom : ${nom}
Téléphone : ${tel}
Service : ${service}
Besoin : ${msg}`};const sms=document.getElementById('sms-devis');if(sms){sms.addEventListener('click',()=>{window.location.href=`sms:+33605585173?body=${encodeURIComponent(buildDevisMessage())}`})}const email=document.getElementById('email-devis');if(email){email.addEventListener('click',(e)=>{e.preventDefault();window.location.href=`mailto:contact@solutechservicehabitat.fr?subject=${encodeURIComponent('Demande de devis - SOLUTECH SERVICE HABITAT')}&body=${encodeURIComponent(buildDevisMessage())}`})}


// V11 — Effet 3D fluide au survol et apparition au défilement
(()=>{
  const cards=[...document.querySelectorAll('.service-card')];
  if(!cards.length)return;
  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  cards.forEach((card,index)=>{
    card.classList.add('reveal-card');
    card.style.transitionDelay=`${Math.min(index%4,3)*70}ms`;
    if(!finePointer)return;
    let frame=0;
    const reset=()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');card.style.setProperty('--mx','50%');card.style.setProperty('--my','50%')};
    card.addEventListener('pointermove',e=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width;
        const y=(e.clientY-r.top)/r.height;
        card.style.setProperty('--ry',`${(x-.5)*10}deg`);
        card.style.setProperty('--rx',`${(.5-y)*8}deg`);
        card.style.setProperty('--mx',`${x*100}%`);
        card.style.setProperty('--my',`${y*100}%`);
      });
    });
    card.addEventListener('pointerleave',reset);
    card.addEventListener('blur',reset,true);
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})
    },{threshold:.13,rootMargin:'0px 0px -45px'});
    cards.forEach(card=>observer.observe(card));
  }else cards.forEach(card=>card.classList.add('is-visible'));
})();

// V14 — Carrousel d'avis automatique, accessible et pilotable
(()=>{
  const track=document.querySelector('.reviews-grid');
  const cards=[...(track?.querySelectorAll('.review-card')||[])];
  const prev=document.querySelector('.review-prev');
  const next=document.querySelector('.review-next');
  const dotsWrap=document.querySelector('.reviews-dots');
  if(!track||!cards.length)return;
  let index=0,timer;
  const visible=()=>window.innerWidth<=640?1:window.innerWidth<=950?2:3;
  const maxIndex=()=>Math.max(0,cards.length-visible());
  const step=()=>cards[0].getBoundingClientRect().width+24;
  const dots=[];
  const buildDots=()=>{
    if(!dotsWrap)return;
    dotsWrap.innerHTML='';dots.length=0;
    for(let i=0;i<=maxIndex();i++){
      const b=document.createElement('button');b.className='review-dot';b.type='button';b.setAttribute('aria-label',`Afficher les avis à partir du ${i+1}`);
      b.addEventListener('click',()=>go(i,true));dotsWrap.appendChild(b);dots.push(b);
    }
  };
  const sync=()=>dots.forEach((d,i)=>d.classList.toggle('active',i===index));
  const go=(i,user=false)=>{
    index=Math.max(0,Math.min(i,maxIndex()));
    track.scrollTo({left:index*step(),behavior:'smooth'});sync();
    if(user)restart();
  };
  const advance=()=>go(index>=maxIndex()?0:index+1);
  const restart=()=>{clearInterval(timer);timer=setInterval(advance,5200)};
  prev?.addEventListener('click',()=>go(index<=0?maxIndex():index-1,true));
  next?.addEventListener('click',()=>go(index>=maxIndex()?0:index+1,true));
  track.addEventListener('mouseenter',()=>clearInterval(timer));
  track.addEventListener('mouseleave',restart);
  track.addEventListener('focusin',()=>clearInterval(timer));
  track.addEventListener('focusout',restart);
  let resizeTimer;
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{index=Math.min(index,maxIndex());buildDots();go(index)},180)});
  buildDots();sync();restart();
})();
