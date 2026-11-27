# Convite Futebol

Página de convite e confirmação de presença para o futebol no Campo do Corujão.

## Publicação no Cloudflare Pages

- Repositório: `Juniorj2021/convite-futebol`
- Branch de produção: `main`
- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `public`
- Diretório de funções Pages: `functions/` (na raiz do repositório)

A página gera a data do evento para amanhã no fuso `America/Sao_Paulo`. As confirmações são recebidas por `/api/confirmacoes` e armazenadas em Cloudflare KV.

## Configuração obrigatória do armazenamento

1. No painel Cloudflare, abra **Workers & Pages → KV** e crie um namespace chamado `futebol-confirmacoes`.
2. Abra **Workers & Pages → Pages → convitefutebol → Settings → Functions**.
3. Em **KV namespace bindings**, adicione um binding:
   - Variable name: `CONFIRMACOES`
   - KV namespace: `futebol-confirmacoes`
4. Salve e faça um novo deploy do projeto.

Sem esse binding, a página abre, mas a API de confirmação responde que o armazenamento ainda não foi configurado.

O endereço do projeto é `https://convitefutebol.pages.dev`.
