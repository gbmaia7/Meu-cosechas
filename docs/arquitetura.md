# Arquitetura

## Objetivo

Registrar a arquitetura observada do projeto e orientar agentes em mudancas
tecnicas sem exigir leitura completa do repositorio.

## Contexto

O Meu-Cosechas e uma aplicacao frontend React com integracao Supabase. O projeto
tambem contem scripts SQL, Edge Functions e rotas internas para fluxos de
cliente, loja e entregador.

## Informacoes atuais

### Frontend

* Framework: React 19.
* Build/dev server: Vite.
* Linguagem: TypeScript.
* Rotas: `src/routes/index.tsx` com `react-router-dom`.
* Estado principal de carrinho/pedidos ativos: `src/context/CartContext.tsx`.
* Componentes compartilhados: `src/components/`.
* Dados locais do cardapio: `src/data/products.ts`.

### Backend e dados

* Cliente Supabase: `src/lib/supabase.ts`.
* SQL e politicas: pasta `supabase/`.
* Edge Functions:
  * `create-infinite-checkout`
  * `verify-infinite-payment`
  * `webhook-infinitepay`
* Regras de loja e entregador observadas em `supabase/store_mvp_schema.sql`.
* Confirmacao segura de entrega por PIN observada em
  `supabase/confirm_delivery_pin.sql`.

### Scripts

* `npm run dev`: inicia Vite em `3000`.
* `npm run lint`: executa `tsc --noEmit`.
* `npm run build`: executa build de producao.

## Pendencias

* Necessita validacao: diagrama formal de entidades Supabase.
* Necessita validacao: estrategia de migrations versionadas.
* A definir: padrao oficial para testes automatizados.
* A definir: estrategia de deploy e rollback.

## Historico de atualizacao

* 2026-06-03: template inicial criado a partir da auditoria tecnica.
