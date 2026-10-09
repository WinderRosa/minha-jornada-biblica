// Minha Jornada Bíblica — planner.js
    const scope=document.getElementById('scope'),book=document.getElementById('book'),chapter=document.getElementById('chapter'),start=document.getElementById('start'),endDate=document.getElementById('end'),daysSelect=document.getElementById('days'),result=document.getElementById('result'),error=document.getElementById('form-error');
    const today=new Date();
    const localISO=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    const dateFromInput=value=>new Date(value+'T12:00:00');
    const fmt=d=>d.toLocaleDateString('pt-BR');
    start.value=localISO(today);
    const oneYear=new Date(today);oneYear.setDate(oneYear.getDate()+364);endDate.value=localISO(oneYear);endDate.min=start.value;
    const picker=document.getElementById('book-picker');
    const pickerList=document.getElementById('picker-list');
    const chosen=new Set();
    books.forEach(([name],i)=>{const label=document.createElement('label');label.className='book-check';const check=document.createElement('input');check.type='checkbox';check.value=String(i);check.addEventListener('change',()=>{if(check.checked)chosen.add(i);else chosen.delete(i);updateSelectedBooks()});label.append(check,document.createTextNode(name));pickerList.appendChild(label)});
    function setChosen(indices){chosen.clear();indices.forEach(i=>chosen.add(i));pickerList.querySelectorAll('input').forEach(input=>input.checked=chosen.has(Number(input.value)));updateSelectedBooks()}
    document.getElementById('select-ot').addEventListener('click',()=>setChosen(Array.from({length:39},(_,i)=>i)));
    document.getElementById('select-nt').addEventListener('click',()=>setChosen(Array.from({length:27},(_,i)=>i+39)));
    document.getElementById('clear-books').addEventListener('click',()=>setChosen([]));
    function currentBooks(){if(scope.value==='ot')return books.slice(0,39);if(scope.value==='nt')return books.slice(39);if(scope.value==='custom')return books.filter((_,i)=>chosen.has(i));return books}
    function hideResult(){result.classList.remove('visible');error.classList.remove('visible');error.textContent='';document.getElementById('cronograma').classList.remove('visible')}
    function fillChapters(){const selected=currentBooks()[Number(book.value)];chapter.replaceChildren();if(selected){for(let i=1;i<=selected[1];i++){const option=document.createElement('option');option.value=String(i);option.textContent='Capítulo '+i;chapter.appendChild(option)}}hideResult()}
    function fillBooks(){const list=currentBooks();const previousName=book.selectedOptions[0]?.textContent;book.replaceChildren();list.forEach(([name],i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=name;book.appendChild(option)});if(previousName){const n=list.findIndex(([name])=>name===previousName);if(n!==-1)book.value=String(n)}book.disabled=list.length===0;chapter.disabled=list.length===0;const hint=document.getElementById('scope-hint');hint.textContent=scope.value==='custom'?'Marque um ou vários livros abaixo.':scope.value==='ot'?'O plano termina em Malaquias.':scope.value==='nt'?'O plano termina em Apocalipse.':'O plano termina em Apocalipse.';picker.hidden=scope.value!=='custom';fillChapters()}
    function updateSelectedBooks(){document.getElementById('selected-count').textContent=chosen.size+' '+(chosen.size===1?'livro selecionado':'livros selecionados');fillBooks()}
    function updateMode(){const isEnd=document.querySelector('input[name="deadline-mode"]:checked').value==='end';document.getElementById('duration-field').hidden=isEnd;document.getElementById('end-field').hidden=!isEnd;daysSelect.disabled=isEnd;endDate.disabled=!isEnd;endDate.required=isEnd;hideResult()}
    scope.addEventListener('change',fillBooks);book.addEventListener('change',fillChapters);chapter.addEventListener('change',hideResult);start.addEventListener('change',()=>{endDate.min=start.value;hideResult()});endDate.addEventListener('change',hideResult);daysSelect.addEventListener('change',hideResult);document.querySelectorAll('input[name="deadline-mode"]').forEach(r=>r.addEventListener('change',updateMode));
    fillBooks();updateMode();
    const fail=message=>{error.textContent=message;error.classList.add('visible');result.classList.remove('visible')};
    document.getElementById('calculator').addEventListener('submit',e=>{e.preventDefault();hideResult();const from=dateFromInput(start.value);if(!start.value||Number.isNaN(from.getTime()))return fail('Informe uma data de início válida.');
      const isEnd=document.querySelector('input[name="deadline-mode"]:checked').value==='end';let deadline,totalDays;
      if(isEnd){if(!endDate.value)return fail('Escolha uma data final.');deadline=dateFromInput(endDate.value);if(Number.isNaN(deadline.getTime()))return fail('Informe uma data final válida.');totalDays=Math.round((deadline-from)/86400000)+1;if(totalDays<1)return fail('A data final não pode ser anterior à data de início.')}else{totalDays=Number(daysSelect.value);deadline=dateFromInput(start.value);deadline.setDate(deadline.getDate()+totalDays-1)}
      const selected=currentBooks();if(!selected.length)return fail('Selecione pelo menos um livro para criar seu plano.');const idx=Number(book.value);const remaining=selected.slice(idx).reduce((acc,item)=>acc+item[1],0)-Number(chapter.value)+1;const perDay=Math.ceil(remaining/totalDays);const basic=Math.floor(remaining/totalDays);const extra=remaining%totalDays;
      document.getElementById('per-day').textContent=perDay+' '+(perDay===1?'capítulo':'capítulos')+'/dia';
      const label=scope.value==='custom'?'os '+selected.length+' livros escolhidos, a partir de '+selected[idx][0]:scope.value==='ot'?'o Antigo Testamento':scope.value==='nt'?'o Novo Testamento':'a Bíblia completa, a partir do ponto escolhido';
      document.getElementById('result-text').textContent='Para concluir '+label+' de '+fmt(from)+' até '+fmt(deadline)+', você tem '+remaining+' capítulos para distribuir em '+totalDays+' dias.';
      document.getElementById('result-details').textContent=remaining<totalDays?'Distribuição sugerida: 1 capítulo em '+remaining+' dias e '+(totalDays-remaining)+' dias livres.':extra===0?'Distribuição sugerida: '+basic+' capítulos por dia.':'Distribuição sugerida: '+extra+' dias com '+(basic+1)+' capítulos e '+(totalDays-extra)+' dias com '+basic+' capítulos.';
      result.classList.add('visible');
      buildSchedule(selected,idx,Number(chapter.value),from,totalDays,remaining);
      document.getElementById('cronograma').scrollIntoView({behavior:'smooth',block:'start'});
    });
