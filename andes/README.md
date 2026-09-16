# Andes Crossing Advisor — PWA

App web instalável (funciona offline) para validação do cruzamento dos Andes
SCEL/SAME: ΔQNH + Ábaco de Harrison, conforme "Operação sobre os Andes REV1".

## Publicar no GitHub Pages

Opção A — dentro do site da LR Aviation (mais rápido):
1. No repositório do site (o que publica lraviation.com.br), crie a pasta `andes/`
   e copie pra dentro dela TODO o conteúdo deste zip
   (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`).
2. Commit + push. Em ~1 min o app estará em `https://lraviation.com.br/andes/`.

Opção B — repositório próprio:
1. Crie um repositório novo (ex.: `andes-advisor`) e envie estes arquivos na raiz.
2. Settings → Pages → Deploy from branch → `main` / root.
3. URL: `https://SEUUSUARIO.github.io/andes-advisor/`.

> O service worker exige HTTPS — GitHub Pages já entrega isso.

## Instalar no iPad
1. Abra a URL no Safari.
2. Compartilhar → **Adicionar à Tela de Início** → Adicionar.
3. O ícone abre em tela cheia e, depois do primeiro acesso, **funciona sem internet**
   (os links de METAR/Windy continuam precisando de rede).

## Atualizações
Ao alterar o `index.html`, mude a versão em `sw.js` (`andes-advisor-v1` → `v2`)
para os iPads baixarem a nova versão no próximo acesso.
