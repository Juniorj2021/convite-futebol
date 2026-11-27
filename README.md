# Convite Futebol

Página de convite e confirmação de presença para o futebol no Campo do Corujão.

## Publicação no Cloudflare Pages

- Repositório: `Juniorj2021/convite-futebol`
- Branch de produção: `main`
- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `public`
- Diretório de funções Pages: `functions/` (na raiz do repositório)

A página apresenta o convite e recebe confirmações com nome. Os registros ficam no Convex, separados pela data do evento, e nomes repetidos não são cadastrados duas vezes.

## Convex utilizado

Este projeto usa o deployment Convex já reservado para o Convite Futebol:

- Cloud URL: `https://reminiscent-oyster-516.convex.cloud`
- HTTP Actions URL: `https://reminiscent-oyster-516.convex.site`

O backend está em `convex/`. O endpoint HTTP `/confirmacoes` lista e registra os participantes.

## Configuração necessária para concluir a publicação

### 1. Autorizar o deploy automático do Convex pelo GitHub

No painel do deployment Convex `reminiscent-oyster-516`, gere uma **Deploy Key**. Depois, no GitHub:

1. Abra o repositório `Juniorj2021/convite-futebol`.
2. Entre em **Settings → Secrets and variables → Actions**.
3. Clique em **New repository secret**.
4. Nome: `CONVEX_DEPLOY_KEY`.
5. Valor: cole a Deploy Key gerada no Convex.

Após salvar, abra **Actions** no GitHub e execute **Deploy Convex backend** (ou faça novo commit em `convex/`). Isso publica o schema e as funções no deployment existente.

### 2. Conectar o Cloudflare Pages ao Convex

No Cloudflare:

1. Abra **Workers & Pages → Pages → convitefutebol → Settings → Variables and Secrets**.
2. Adicione a variável para **Production**:
   - Nome: `CONVEX_SITE_URL`
   - Valor: `https://reminiscent-oyster-516.convex.site`
3. Salve e faça um novo deploy do Pages.

Não é necessário criar KV nem configurar o antigo binding `CONFIRMACOES`.

## Endereço do convite

`https://convitefutebol.pages.dev`
