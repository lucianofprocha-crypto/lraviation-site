# US Ebola Attestation — LR Aviation (v1.1.2)

Ferramenta gratuita e offline (PWA) para operadores coletarem e arquivarem a declaração de Ebola do CDC
(Attachment A, OMB 0920-1474) em voos do exterior para os EUA — decolagens a partir de 3 nov 2026 23:59 EST (4 nov 04:59 UTC).

## Publicar no site
1. No repositório `lraviation-site`, crie a pasta `ebola/` e envie **todo o conteúdo desta pasta** (inclusive `vendor/`).
2. Commit → GitHub Pages publica em `https://lraviation.com.br/ebola/`.
3. Link do passageiro (autoatendimento): `https://lraviation.com.br/ebola/#/p`
4. Opcional: adicionar um card na página inicial do site apontando para `/ebola/`.

Ao lançar nova versão: altere `APP_VERSION` em `app.js` **e** `CACHE` em `sw.js` (senão o iPad continua com a versão antiga em cache).

## Como funciona
- **Voos**: um registro por perna para os EUA (matrícula, callsign, origem = último aeroporto estrangeiro, destino, ETD/ETA UTC, pax previstos).
  "Guardar até" = chegada (ETA, ou ETD se não houver) + 42 dias.
- **3 formas de coletar**: assinatura no iPad do operador; QR gerado no celular do passageiro (link `#/p`); arquivo `.txt` enviado pelo passageiro (WhatsApp/AirDrop/e-mail). Também importa foto/print do QR.
- **PDF por voo**: capa com manifesto + o **formulário oficial do CDC preenchido** para cada passageiro (nome, opção marcada, representante/relação, assinatura, data), com rodapé de registro eletrônico (UTC, método, voo, SHA-256).
- **Dados só no aparelho** (IndexedDB). Nada vai para servidor. Backup/restore em JSON nos Ajustes.
- Idiomas da interface: EN / PT / ES. O texto oficial em inglês prevalece; PT/ES são traduções não oficiais marcadas como tal.
- **Exportar PDF** abre o PDF dentro do app (todas as páginas); de lá, "Compartilhar / Salvar" manda para Arquivos, e-mail, AirDrop ou impressão.
- Duplicados (mesmo QR lido duas vezes) são detectados pelo hash.
- **Importar GENDEC** (PDF com texto selecionável, ou CSV com colunas nome/tipo/função/data de nascimento): cria o voo com matrícula, origem, destino e datas, e monta a lista de tripulantes e passageiros. Cada pessoa aparece como pendente, com botão "Assinar" já preenchido. Menores de 18 (pela data de nascimento) vêm marcados e abrem direto no modo representante. QR/arquivos recebidos são ligados automaticamente ao nome da lista; quem não estiver na GENDEC aparece separado, com opção de vincular manualmente. O PDF lista quem ainda não declarou.
- Da GENDEC só ficam nome, função e a marcação de menor. Passaporte e data de nascimento são lidos na memória e descartados.
- Avisa se o destino não for aeroporto dos EUA ou se a origem for nos EUA.

## Avisos
- **Tripulação:** o CDC não deixa claro; por precaução o app coleta declaração de todos os tripulantes também (papel "Tripulante" no formulário, contagem própria, marcada no PDF como precautionary).
- iPad/iPhone: instalar na Tela de Início (Safari → Compartilhar → Adicionar à Tela de Início); fora disso o Safari pode apagar dados de sites não usados.
- Exportar o PDF antes da decolagem e arquivar fora do aparelho.
- Sem vínculo com o CDC. O operador é responsável pelo cumprimento. Conferir periodicamente o formulário em vigor:
  https://www.cdc.gov/port-health/legal-authorities/attestation-order.html
- Nomes com caracteres fora do alfabeto latino aparecem com "?" no PDF (limitação das fontes padrão do PDF).

## Arquivos
| Arquivo | Função |
|---|---|
| index.html | interface e estilos |
| app.js | lógica (voos, assinatura, QR, PDF, offline) |
| i18n.js | textos EN/PT/ES e texto oficial do Attachment A |
| cdc-attestation-form.pdf | formulário oficial do CDC (obra do governo dos EUA, domínio público) |
| sw.js, manifest.webmanifest, icon-*.png | PWA offline |
| gendec.js | leitura de GENDEC (PDF/CSV) e vínculo com a lista |
| vendor/ | pdf-lib 1.17.1 (MIT), pdf.js 3.11.174 (Apache-2.0), jsQR 1.4.0 (Apache-2.0), qrcode-generator 1.4.4 (MIT) |
