# G550 Study Program — PWA

Programa de estudos G550 (recorrência, 5 semanas, 27 sessões de 2h) com o conteúdo dentro do app:
21 study guides (convertidos dos .docx de "Study Guides (Improved)") e 401 flash cards (dos PDFs).

- Programa: cada sessão abre o GUIA e os CARDS correspondentes; Self Check junta os cards da semana.
- Biblioteca: todos os guias e baralhos; revisão geral e "só os que errei".
- Buscar: busca em todos os guias e cards.
- Leitor: índice de seções, links internos, letra maior, lembra onde parou.
- Dados (progresso, notas, placar dos cards) só no iPad (localStorage, chave g550_study_v1).

## Arquivos
index.html · content.js (guias + cards) · img/ (figuras Cold Weather e FLEX) · sw.js · manifest.json · ícones

## Atualizar conteúdo
Quando editar um guia (.docx) ou flash cards (.pdf), peça para regenerar o content.js
e suba a versão no sw.js (v3 → v4).

## Instalar no iPad
Publicar a pasta (ex.: lraviation.com.br/estudos/) → Safari → Compartilhar → Adicionar à Tela de Início.
Funciona offline após o primeiro acesso.
