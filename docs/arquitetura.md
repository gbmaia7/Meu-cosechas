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

### SDK MercadoPago.js v2

* Script carregado em `index.html` (tag `<script>` no body, sem async/defer).
* Instancia **unica** inicializada em `App.tsx` via `useEffect` e armazenada
  em `window.__mpGlobal` para evitar multiplas instancias.
* Inicializar com `new window.MercadoPago(key, { locale: 'pt-BR' })`.
* Regra critica: nunca criar mais de uma instancia do MercadoPago por sessao.
  Multiplas instancias quebram os Secure Fields silenciosamente.
* Script de seguranca `https://www.mercadopago.com/v2/security.js` carregado
  em `index.html` com `view="checkout"` para gerar `window.MP_DEVICE_SESSION_ID`.
* `window.MP_DEVICE_SESSION_ID` e enviado junto ao payload de pagamento para
  device fingerprinting.

### Secure Fields (tokenizacao de cartao)

* Hook compartilhado: `src/lib/useSecureCardFields.ts`.
* Cria campos via `mp.fields.create('cardNumber' | 'expirationDate' | 'securityCode')`.
* Monta os campos em divs com IDs especificos; containers NAO devem ter
  `overflow: hidden` (bloqueia touch events em iframes no iOS/Safari).
* Tokeniza via `mp.fields.createCardToken()` no submit.
* Usado em:
  * `src/screens/NovoCartao.tsx` (IDs: `nc-card-number`, `nc-expiration`, `nc-cvv`)
  * `src/screens/Pagamento.tsx` (IDs: `pg-card-number`, `pg-expiration`, `pg-cvv`)
* Requer `VITE_MERCADO_PAGO_PUBLIC_KEY` configurada no Vercel. Sem ela, os
  divs ficam vazios e o usuario nao consegue digitar.

### Backend e dados

* Cliente Supabase: `src/lib/supabase.ts`.
* SQL e politicas: pasta `supabase/`.
* Edge Functions Mercado Pago:
  * `create-mercado-pago-payment`: cria pedido, chama API MP via fetch raw com
    header `X-meli-session-id` (device fingerprint), salva em `order_payments`.
  * `get-mercado-pago-payment`: consulta e sincroniza status.
  * `webhook-mercado-pago`: recebe notificacoes e atualiza pedido.
* Edge Functions InfinitePay removidas em 2026-06-04.
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
