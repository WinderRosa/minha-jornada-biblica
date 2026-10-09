# Minha Jornada Bíblica

Site estático e gratuito para montar cronogramas de leitura bíblica.

## Rodar no VS Code

1. Abra a pasta `minha-jornada-biblica` no VS Code.
2. Instale a extensão Live Server.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não precisa instalar pacotes, rodar npm, criar conta ou configurar servidor.

## Estrutura

- `index.html`: conteúdo e formulários da página.
- `css/style.css`: visual do site, versão para celular e impressão A4.
- `js/bible.js`: lista dos 66 livros e quantidade de capítulos.
- `js/planner.js`: controles do formulário, escolha de livros, datas e cálculo.
- `js/progress.js`: cronograma diário, seleção de capítulos, progresso e localStorage.
- `js/pdf.js`: impressão do cronograma compacto (na janela, escolha **Salvar como PDF**).
- `js/app.js`: menu de celular e demonstração da página.
- `assets/images/` e `assets/icons/`: pastas reservadas para futuras imagens e ícones.

## Observações

- O progresso é guardado **apenas no navegador** onde foi marcado. Não há login nem sincronização.
- A impressão visa até duas páginas A4. Confira a prévia de impressão: planos muito grandes podem exigir letras bastante pequenas ou ajustes de escala.
- Os arquivos JS são scripts clássicos carregados com `defer`, **na ordem especificada no HTML**. As funções compartilhadas entre eles dependem dessa ordem.
- O cronograma começa no livro e capítulo selecionados e continua até o último livro do conjunto escolhido, na ordem bíblica.
