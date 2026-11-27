# Convite Futebol — Cloudflare Pages

Este projeto usa uma Cloudflare Pages Function em `functions/index.js` para entregar HTML com Open Graph renderizado no servidor. Isso é importante porque o WhatsApp lê as metatags sem executar JavaScript.

## Configuração de implantação

- Repositório: `Juniorj2021/convite-futebol`
- Branch de produção: `main`
- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `/` (raiz do projeto)
- Root directory: deixar vazio (raiz)

A pasta `functions` deve permanecer na raiz do repositório, no mesmo nível de `index.html`.

A página calcula a data do dia seguinte no fuso `America/Sao_Paulo`. O botão abre o formulário Google já existente; nenhuma resposta ou configuração do formulário é alterada.

## Observação

Depois da primeira publicação, use o endereço `.pages.dev` criado pelo Cloudflare para compartilhar no WhatsApp. Se a prévia antiga continuar aparecendo, envie o link com um parâmetro novo, por exemplo `?v=2`, para forçar uma nova leitura do preview.
