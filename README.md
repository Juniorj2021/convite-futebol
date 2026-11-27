# Convite Futebol

Página de confirmação de presença para o futebol no Campo do Corujão.

## Publicação no Cloudflare Pages

Este repositório agora inclui uma Cloudflare Pages Function em `functions/index.js`, que gera no servidor o HTML e as metatags Open Graph para a prévia do WhatsApp. O diretório de saída está configurado como `public`.

Crie um projeto **Cloudflare Pages** com o nome exato `convitefutebol`, conecte este repositório (`Juniorj2021/convite-futebol`) à branch `main` e configure o diretório de saída como `public`. Não use o comando `npx wrangler deploy`, pois ele publica Workers.

Para implantação manual, use `npx wrangler pages deploy public --project-name convitefutebol`.

A data de amanhã é calculada no fuso `America/Sao_Paulo`. O botão abre o formulário Google já existente, sem alterar suas respostas ou configurações.

O Worker anterior `convite-futebol.joel-rmjunior.workers.dev` permanece separado; o endereço `convitefutebol.pages.dev` só ficará ativo depois de criar/publicar o projeto Pages com esse nome.
