// Minha Jornada Bíblica — pdf.js
    // A versão PDF agrupa capítulos sequenciais do mesmo livro: "Salmos 1–11".
    // Assim, mesmo planos anuais cabem em uma tabela de até duas páginas A4.
    function groupReadings(items){
      if(!items.length)return 'Livre / revisão';
      const groups=[];
      items.forEach(item=>{
        const last=groups[groups.length-1];
        if(last&&last.book===item.book&&item.chapter===last.last+1)last.last=item.chapter;
        else groups.push({book:item.book,first:item.chapter,last:item.chapter});
      });
      return groups.map(g=>g.book+' '+g.first+(g.last!==g.first?'–'+g.last:'')).join('; ');
    }
    document.getElementById('print-plan').addEventListener('click',()=>{
      if(!activePlan)return;
      document.getElementById('print-container')?.remove();
      const root=document.createElement('div');root.id='print-container';
      const dates=activePlan.days;
      // Até 4 colunas distribuídas em duas folhas. Para planos muito extensos,
      // usamos 6 colunas (3 por folha) para reduzir a altura das listas.
      const columnsPerPage=dates.length>440?3:2;
      const pageCount=dates.length>columnsPerPage*85?2:1;
      const columnCount=columnsPerPage*pageCount;
      const perColumn=Math.ceil(dates.length/columnCount);
      const columns=[];
      for(let pg=0;pg<pageCount;pg++){
        const page=document.createElement('section');page.className='print-page';
        const head=document.createElement('div');head.className='print-header';
        const info=document.createElement('div');
        const heading=document.createElement('h1');heading.textContent='Minha Jornada Bíblica · Cronograma de leitura';
        const sub=document.createElement('p');sub.className='print-meta';sub.textContent=document.getElementById('schedule-description').textContent+' · Gratuito';
        info.append(heading,sub);
        const pageNum=document.createElement('span');pageNum.className='print-page-number';pageNum.textContent='Página '+(pg+1)+' de '+pageCount;
        head.append(info,pageNum);
        const grid=document.createElement('div');grid.className='print-columns';grid.style.gridTemplateColumns='repeat('+columnsPerPage+',minmax(0,1fr))';
        for(let col=0;col<columnsPerPage;col++){
          const colIndex=pg*columnsPerPage+col;
          const column=document.createElement('div');column.className='print-column';
          const th=document.createElement('div');th.className='print-table-head';
          ['DATA','LEITURA','✓'].forEach(label=>{const span=document.createElement('span');span.textContent=label;th.append(span)});
          column.append(th);
          dates.slice(colIndex*perColumn,(colIndex+1)*perColumn).forEach((day,ind)=>{
            const i=colIndex*perColumn+ind;
            const row=document.createElement('div');row.className='print-entry';
            const date=document.createElement('span');date.className='print-date';date.textContent=fmt(day.date).slice(0,5);
            const reading=document.createElement('span');reading.className='print-readings';reading.textContent=groupReadings(day.items);
            const checkbox=document.createElement('span');checkbox.className='print-checkbox';
            const isDone=day.items.length>0&&day.items.every(item=>activePlan.completed[item.book+'|'+item.chapter]);
            checkbox.textContent=isDone?'✓':'';
            row.append(date,reading,checkbox);column.append(row);
          });
          grid.append(column);columns.push(column);
        }
        const footer=document.createElement('div');footer.className='print-footer';
        footer.innerHTML='<span>Marque ✓ quando concluir todos os capítulos do dia.</span><span>Minha Jornada Bíblica • um dia de cada vez</span>';
        page.append(head,grid,footer);root.append(page);
      }
      document.body.append(root);
      document.body.classList.add('print-schedule');
      // Se uma combinação de muitos livros criar linhas longas, reduzimos
      // gradualmente a tipografia para evitar uma terceira folha na impressão.
      for(let size=7.3;size>=4.3;size-=.3){
        root.style.setProperty('--print-size',size.toFixed(1)+'px');
        if(columns.every(c=>c.scrollHeight<=c.clientHeight+1))break;
      }
      window.print();
    });
    window.addEventListener('afterprint',()=>{document.body.classList.remove('print-schedule');document.getElementById('print-container')?.remove()});
