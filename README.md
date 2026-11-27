# Convite Futebol

Página de confirmação de presença para o futebol no Campo do Corujão.

## Publicação

Este repositório está configurado como **Cloudflare Worker**, pois a implantação atual executa `npx wrangler deploy`.

- Arquivo de configuração: `wrangler.jsonc`
- Código do Worker: `src/index.js`
- Comando de implantação: `npx wrangler deploy`

Não configure este repositório como Pages Functions. O Worker gera o HTML e as metatags Open Graph no servidor, para que o WhatsApp consiga montar a prévia sem executar JavaScript.

A data de amanhã é calculada no fuso `America/Sao_Paulo`. O botão abre o formulário Google já existente, sem alterar suas respostas ou configurações.

O nome do Worker configurado é `convite-futebol`.
