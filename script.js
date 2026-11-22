(function(){
  // mobile menu
  var b=document.querySelector('.burger'), l=document.querySelector('.links');
  if(b&&l){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');b.setAttribute('aria-expanded','false')})});}

  // reveal on scroll
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(e){io.observe(e)});
    var st=document.querySelectorAll('.step');
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('lit')})},{rootMargin:'0px 0px -40% 0px'});
    st.forEach(function(e){io2.observe(e)});
  } else rv.forEach(function(e){e.classList.add('in')});

  // lightbox
  var lb=document.querySelector('.lb');
  if(lb){
    var im=lb.querySelector('img'), items=[], idx=0;
    document.querySelectorAll('[data-lb]').forEach(function(btn,i){
      items.push(btn);
      btn.addEventListener('click',function(){idx=i;show();lb.classList.add('open');lb.querySelector('.x').focus()});
    });
    function show(){var t=items[idx].querySelector('img');im.src=items[idx].getAttribute('data-lb');im.alt=t?t.alt:''}
    function close(){lb.classList.remove('open');items[idx]&&items[idx].focus()}
    lb.querySelector('.x').addEventListener('click',close);
    lb.querySelector('.pv').addEventListener('click',function(){idx=(idx-1+items.length)%items.length;show()});
    lb.querySelector('.nx').addEventListener('click',function(){idx=(idx+1)%items.length;show()});
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close(); if(e.key==='ArrowLeft')lb.querySelector('.pv').click(); if(e.key==='ArrowRight')lb.querySelector('.nx').click();});
  }

  // schedule (times in WAT = UTC+1)
  var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function wat(y,m,d,h,mi){return new Date(Date.UTC(y,m,d,h-1,mi))}
  function events(from){
    var out=[], y=from.getUTCFullYear(), m=from.getUTCMonth();
    for(var k=0;k<3;k++){
      var yy=y+Math.floor((m+k)/12), mm=(m+k)%12, fri=0, last=new Date(Date.UTC(yy,mm+1,0)).getUTCDate();
      for(var d=1;d<=last;d++){
        var dow=new Date(Date.UTC(yy,mm,d)).getUTCDay();
        if(dow===5){fri++;
          if(fri===2||fri===4) out.push({t:'Zion Convergence Prayer Meeting',s:wat(yy,mm,d,19,0),e:wat(yy,mm,d,20,30),u:'https://bit.ly/ZC-Fridays',dsc:"Prophetic prayer and intercession in God's presence"});
          if(fri===1||fri===3) out.push({t:'Faith and Bible Discussions',s:wat(yy,mm,d,20,0),e:wat(yy,mm,d,21,0),u:'https://bit.ly/ZC-Fridays',dsc:'Open conversations on Scripture and the Christian life'});
        }
        if(dow===6){var sd=wat(yy,mm,d,15,0); if(sd>=wat(2026,10,7,0,0)&&sd<=wat(2026,11,12,23,0)) out.push({t:'School of Intimacy',s:sd,e:wat(yy,mm,d,17,0),u:'https://bit.ly/ZC-SOI',dsc:"Growing in God's Presence and Recognising His Voice"});}
        if(d===last) out.push({t:'ZC Crossover Prayers',s:wat(yy,mm,d,23,45),e:wat(yy,mm,d+1,0,15),u:'https://bit.ly/ZC-Crossover',dsc:'Praying out of the old month and into the new'});
      }
    }
    return out.sort(function(a,b){return a.s-b.s});
  }
  function fmt(dt){var w=new Date(dt.getTime()+3600000), h=w.getUTCHours(), mi=w.getUTCMinutes(), ap=h>=12?'p.m.':'a.m.', hh=h%12||12;
    return DAYS[w.getUTCDay()]+', '+w.getUTCDate()+' '+MONTHS[w.getUTCMonth()]+' '+w.getUTCFullYear()+', '+hh+':'+(mi<10?'0':'')+mi+' '+ap+' WAT'}
  function z(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
  var nx=document.getElementById('next');
  if(nx){
    var now=new Date(), ev=events(now).filter(function(e){return e.e>now})[0];
    if(ev){
      nx.querySelector('h3').textContent=ev.t;
      nx.querySelector('time').textContent=fmt(ev.s); nx.querySelector('time').setAttribute('datetime',ev.s.toISOString());
      nx.querySelector('.meet').href=ev.u;
      var g='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Zion Convergence: '+ev.t)+'&dates='+z(ev.s)+'/'+z(ev.e)+'&details='+encodeURIComponent(ev.dsc+'\nJoin on Google Meet: '+ev.u)+'&location='+encodeURIComponent(ev.u);
      nx.querySelector('.gcal').href=g;
      nx.querySelector('.ics').addEventListener('click',function(){
        var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Zion Convergence//EN','BEGIN:VEVENT','UID:'+z(ev.s)+'@zionconvergence','DTSTAMP:'+z(new Date()),'DTSTART:'+z(ev.s),'DTEND:'+z(ev.e),'SUMMARY:Zion Convergence: '+ev.t,'DESCRIPTION:'+ev.dsc+' — Join on Google Meet: '+ev.u,'LOCATION:'+ev.u,'END:VEVENT','END:VCALENDAR'].join('\r\n');
        var a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='zion-convergence.ics'; document.body.appendChild(a); a.click(); a.remove();
      });
      nx.hidden=false;
    }
  }


  // monthly theme (add each new month here)
  var THEMES={
    '2026-11':{t:'Satisfaction',p:'“Blessed are you who are hungry now, for you shall be satisfied.” Luke 6:21',f:'The year will not end without God fulfilling His promises to us and our families. The God of the eleventh hour will do what our circumstances said could no longer happen.',r:'Isaiah 62:6–9 · Luke 6:21'},
    '2026-10':{t:'Stability',p:'“He will be the stability of your times, abundance of salvation, wisdom, and knowledge.”',f:'God is our constant source of stability, wisdom, strength, peace and security, even in changing times.',r:'Isaiah 33:5–6'}
  };
  var mo=document.getElementById('month');
  if(mo){
    var w=new Date(Date.now()+3600000), key=w.getUTCFullYear()+'-'+('0'+(w.getUTCMonth()+1)).slice(-2), th=THEMES[key];
    var mname=MONTHS[w.getUTCMonth()]+' '+w.getUTCFullYear();
    mo.querySelector('.eyebrow').textContent=mname;
    if(th){mo.querySelector('h3').textContent=th.t;mo.querySelector('.promise').textContent=th.p;mo.querySelector('.focus').textContent=th.f;mo.querySelector('.ref').textContent=th.r;}
    else{mo.querySelector('h3').textContent='Coming soon';mo.querySelector('.promise').textContent="This month's theme is announced at the ZC Crossover Prayers and shared in our WhatsApp community.";mo.querySelector('.ref').textContent='Crossover Prayers · last day of each month';}
  }

  // after the first School of Intimacy cohort
  if(new Date()>wat(2026,11,12,17,0)) document.body.classList.add('soi-ended');

  // SOI week status
  var now2=new Date(), marked=false;
  document.querySelectorAll('.wk[data-date]').forEach(function(w){
    var p=w.getAttribute('data-date').split('-'), end=wat(+p[0],+p[1]-1,+p[2],17,0), st=w.querySelector('.status');
    if(end<now2){w.classList.add('done'); if(st){st.textContent='Watch again';st.className='status past'}; var a=w.querySelector('.join'); if(a){a.href='https://youtube.com/@ZionConvergence'; a.lastChild.textContent='Watch on YouTube'}}
    else if(!marked){marked=true; if(st){st.textContent='Next';st.className='status st-next'}; w.open=true}
  });

  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
})();
