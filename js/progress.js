// Minha Jornada Bíblica — progress.js
    let activePlan=null;
    const scheduleList=document.getElementById('schedule-list');
    const formatDay=d=>d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
    function buildSchedule(selected,startIndex,startChapter,from,totalDays,totalChapters){
      const sequence=[];
      for(let i=startIndex;i<selected.length;i++)for(let ch=(i===startIndex?startChapter:1);ch<=selected[i][1];ch++)sequence.push({book:selected[i][0],chapter:ch});
      const signature=JSON.stringify({books:selected.map(x=>x[0]),startIndex,startChapter,start:localISO(from),totalDays});
      const storageKey='mjb:plan:'+signature;
      let completed={};try{completed=JSON.parse(localStorage.getItem(storageKey)||'{}')||{}}catch{completed={}}
      const days=[];const base=Math.floor(sequence.length/totalDays),extra=sequence.length%totalDays;let offset=0;
      for(let i=0;i<totalDays;i++){
        const count=base+(i<extra?1:0);const d=new Date(from);d.setDate(d.getDate()+i);
        days.push({date:d,items:sequence.slice(offset,offset+count)});offset+=count;
      }
      activePlan={days,storageKey,completed,totalChapters};
      document.getElementById('schedule-description').textContent=`${fmt(from)} a ${fmt(days.at(-1).date)} · ${totalChapters} capítulos · ${totalDays} dias`;
      scheduleList.replaceChildren();
      days.forEach((day,i)=>{
        const card=document.createElement('article');card.className='day-card';card.id='reading-day-'+i;
        const head=document.createElement('div');head.className='day-top';
        const title=document.createElement('strong');title.textContent='Dia '+(i+1)+' · '+formatDay(day.date);
        const status=document.createElement('span');status.className='day-status';status.textContent=day.items.length+' capítulos';head.append(title,status);
        const body=document.createElement('div');body.className='day-body';
        if(!day.items.length){const rest=document.createElement('span');rest.className='rest-day';rest.textContent='Dia livre / para colocar a leitura em dia';body.append(rest)}
        day.items.forEach(item=>{
          const key=item.book+'|'+item.chapter;
          const label=document.createElement('label');label.className='chapter-check';
          const check=document.createElement('input');check.type='checkbox';check.checked=!!completed[key];check.dataset.chapterKey=key;
          check.addEventListener('change',()=>{if(check.checked)activePlan.completed[key]=true;else delete activePlan.completed[key];try{localStorage.setItem(storageKey,JSON.stringify(activePlan.completed))}catch{}updatePlanProgress()});
          const text=document.createElement('span');text.textContent=item.book+' '+item.chapter;label.append(check,text);body.append(label);
        });card.append(head,body);scheduleList.append(card);
      });
      document.getElementById('days-count').textContent=String(totalDays);
      document.getElementById('cronograma').classList.add('visible');
      updatePlanProgress();
    }
    function updatePlanProgress(){
      if(!activePlan)return;
      let done=0;
      activePlan.days.forEach((day,i)=>{
        const checks=[...document.querySelectorAll('#reading-day-'+i+' input[type="checkbox"]')];
        const n=checks.filter(x=>x.checked).length;done+=n;
        const status=document.querySelector('#reading-day-'+i+' .day-status');
        status.textContent=checks.length?`${n}/${checks.length} lidos`:'Dia livre';
        status.classList.toggle('done-tag',checks.length>0&&checks.length===n);
      });
      document.getElementById('chapters-done').textContent=done+'/'+activePlan.totalChapters;
      const pct=activePlan.totalChapters?Math.round(done/activePlan.totalChapters*100):100;
      document.getElementById('plan-percent').textContent=pct+'%';
      document.getElementById('schedule-progress').style.width=pct+'%';
    }
    document.getElementById('go-today').addEventListener('click',()=>{
      if(!activePlan)return;const today=localISO(new Date());let i=activePlan.days.findIndex(x=>localISO(x.date)===today);
      if(i<0)i=activePlan.days.findIndex(x=>x.items.some(y=>!activePlan.completed[y.book+'|'+y.chapter]));
      const card=document.getElementById('reading-day-'+Math.max(0,i));
      card?.scrollIntoView({behavior:'smooth',block:'center'});
    });
