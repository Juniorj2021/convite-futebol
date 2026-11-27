# Convite Futebol

Página de confirmação de presença para o futebol no Campo do Corujão.

## Publicação no Cloudflare Pages

- Repositório: `Juniorj2021/convite-futebol`
- Branch de produção: `main`
- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `public`
- Diretório de funções Pages: `functions/` (na raiz do repositório)

A função `functions/index.js` gera a página e os metadados Open Graph dinamicamente, incluindo a data de amanhã no fuso `America/Sao_Paulo`. O botão abre o formulário Google já existente.

O endereço pretendido é `https://convitefutebol.pages.dev`, desde que esse nome esteja disponível e seja atribuído ao projeto Pages na conta Cloudflare.
