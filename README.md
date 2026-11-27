# Convite Futebol

Página de confirmação de presença para o futebol no Campo do Corujão.

## Publicação

Este repositório está configurado como **Cloudflare Worker**.

- Configuração: `wrangler.jsonc`
- Código: `src/index.js`
- Nome do Worker: `convitefutebol`
- Comando: `npx wrangler deploy`

O endereço workers.dev inclui também o subdomínio da conta Cloudflare, no formato `convitefutebol.<subdominio-da-conta>.workers.dev`.

A data de amanhã é calculada no fuso `America/Sao_Paulo`. O botão abre o formulário Google já existente.
