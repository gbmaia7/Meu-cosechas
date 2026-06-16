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

### Pagamento online (Pix apenas)

* Cartao de credito/debito online (Secure Fields, 3DS, SDK MercadoPago.js v2,
  cartoes salvos) foi **removido** em 2026-06-16. Ver decisao em
  `docs/pagamentos-mercado-pago.md`.
* Pix continua via Mercado Pago Orders API, sem SDK frontend — o pagamento e
  criado direto pela Edge Function via fetch raw.

### Backend e dados

* Cliente Supabase: `src/lib/supabase.ts`.
* SQL e politicas: pasta `supabase/`.
* Edge Functions Mercado Pago:
  * `create-mercado-pago-payment`: cria pedido, cria pagamento Pix via fetch
    raw na Orders API, salva em `order_payments`.
  * `get-mercado-pago-payment`: consulta e sincroniza status.
  * `webhook-mercado-pago`: recebe notificacoes e atualiza pedido.
* Edge Functions InfinitePay removidas em 2026-06-04.
* Edge Functions `save-card` e `delete-card` removidas em 2026-06-16 (cartao
  salvo deixou de existir sem cobranca online por cartao).
* `npm:mercadopago` e `esm.sh/mercadopago` sao incompativeis com o bundler
  do Supabase/Deno. Usar fetch raw para chamar a API do MP.
* Regras de loja e entregador: `supabase/store_mvp_schema.sql`.
* Confirmacao segura de entrega por PIN: `supabase/confirm_delivery_pin.sql`.

### Scripts

* `npm run dev`: inicia Vite em `3000`.
* `npm run lint`: executa `tsc --noEmit`.
* `npm run build`: executa build de producao.

## Pendencias

* Necessita validacao: diagrama formal de entidades Supabase.
* Necessita validacao: estrategia de migrations versionadas.
* A definir: padrao oficial para testes automatizados.
* Route guards para `/loja` e `/entregador` (atualmente sem protecao adequada).
* Remover dependencias mortas: `@google/genai`, `express`.

## Historico de atualizacao

* 2026-06-03: template inicial criado a partir da auditoria tecnica.
* 2026-06-03: adicionada camada Mercado Pago Checkout Transparente.
* 2026-06-05: adicionados Secure Fields, singleton __mpGlobal, device
  fingerprinting, restricoes de SDK e incompatibilidade npm:mercadopago/Deno.
* 2026-06-13: explicitado script `security.js` do Mercado Pago para gerar
  `MP_DEVICE_SESSION_ID` no checkout.
* 2026-06-13: removido `security.js` de `index.html`; carregamento agora e
  dinamico via `loadMercadoPagoSecurity()` no contexto real de checkout para
  corrigir `tracking_id: security:none` e `cc_rejected_high_risk`.
* 2026-06-16: removido cartao de credito/debito online (Secure Fields, 3DS,
  SDK MercadoPago.js v2, cartoes salvos, `security.js`, Edge Functions
  `save-card`/`delete-card`). Pix continua automatico; cartao/dinheiro
  passam a ser pagos fisicamente com confirmacao manual na loja/entregador.
