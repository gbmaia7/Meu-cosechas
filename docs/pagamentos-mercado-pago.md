# Pagamentos Mercado Pago

## Objetivo

Registrar a decisao e o fluxo oficial de pagamentos do Meu-Cosechas com
Mercado Pago Checkout Transparente, mantendo a experiencia dentro do app.

## Contexto

Gateway oficial: Mercado Pago Checkout Transparente.
InfinitePay descartado por redirecionar para checkout externo.

## Diretriz principal

* Nao usar Checkout Pro, link de pagamento ou redirecionamento externo.
* `VITE_MERCADO_PAGO_PUBLIC_KEY` somente no frontend.
* `MERCADO_PAGO_ACCESS_TOKEN` somente em Supabase Edge Functions.
* Tokenizar cartao no frontend com Secure Fields antes de chamar o backend.
* Confirmacao final via webhook ou consulta backend sincronizada.

## Variaveis de ambiente

Frontend Vite (obrigatorio no Vercel para Secure Fields funcionarem):

* `VITE_MERCADO_PAGO_PUBLIC_KEY` — chave publica de producao (`APP_USR-...`)

Backend/Supabase Edge Functions (todas obrigatorias):

* `MERCADO_PAGO_ACCESS_TOKEN`
* `MERCADO_PAGO_WEBHOOK_SECRET`
* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`

## Fluxo de cartao (Secure Fields)

1. `App.tsx` inicializa `new MercadoPago(key, { locale: 'pt-BR' })` no mount
   e armazena em `window.__mpGlobal`.
2. `useSecureCardFields` reutiliza `window.__mpGlobal` (nunca cria segunda
   instancia).
3. Campos de cartao sao iframes do MP (`cardNumber`, `expirationDate`,
   `securityCode`). Dados nunca transitam pelo backend do app.
4. No submit: `mp.fields.createCardToken({ cardholderName, CPF })` → token.
5. Frontend exige CPF valido e aguarda `MP_DEVICE_SESSION_ID` antes de criar
   pagamento com cartao.
6. Frontend envia token + `payment_method_id` + `device_session_id` para
   `create-mercado-pago-payment`.
7. Edge Function chama `POST /v1/payments` com header `X-meli-session-id`.
8. Para cartao, Edge Function usa email real do usuario como sinal antifraude.
   Para Pix, mantem alias `cliente{userId}@meucosechas.app` para evitar
   conflito com email do recebedor.

### Regras criticas de Secure Fields

* Containers dos campos NAO podem ter `overflow: hidden` (bloqueia iframes
  no iOS/Safari).
* Usar altura minima de `52px` nos containers.
* Apenas UMA instancia MercadoPago por sessao (`window.__mpGlobal`).
* Cartoes de teste (ex: `5031 4332 1540 6351`) so funcionam com credenciais
  sandbox (`TEST-...`). Em producao usar cartao real.

## Fluxo Pix

1. Frontend envia payload (sem token) para `create-mercado-pago-payment`.
2. Edge Function cria pagamento Pix no MP e retorna `qr_code` e `ticket_url`.
3. Frontend exibe QR e/ou copia-e-cola.
4. Webhook ou polling via `get-mercado-pago-payment` atualiza status.

### Email do pagador Pix

O MP rejeita quando o email do pagador e igual ao email do recebedor. Solucao:
usar alias `cliente+{userId_slice}@meucosechas.app` para pagamentos Pix.

## Device Fingerprinting

* `window.MP_DEVICE_SESSION_ID` e gerado pelo script de seguranca do Mercado Pago
  `https://www.mercadopago.com/v2/security.js` com `view="checkout"` e
  `output="mp-device-session-id"`.
* O script NAO deve estar em `index.html`. Deve ser carregado DINAMICAMENTE por
  `loadMercadoPagoSecurity()` em `src/screens/Pagamento.tsx` quando o usuario
  seleciona cartao. Razao: se carregado na pagina inicial, o device session ID
  e gerado no contexto errado (browsing, nao checkout) e o MP retorna
  `security:none`.
* O script DEVE incluir os tres atributos: `view="checkout"`,
  `output="mp-device-session-id"` e `public_key`. Sem `public_key`, o script
  gera um ID local (`window.MP_DEVICE_SESSION_ID`) mas nao consegue registrar
  o fingerprint no backend do MP — o elemento DOM nunca e preenchido e o
  pagamento fica bloqueado ou retorna `security:none`.
* Enviado pelo frontend como `device_session_id` no body do pagamento.
* Edge Function repassa como header `X-meli-session-id` na chamada ao MP.
* Obrigatorio para aprovacao no Avaliar Qualidade (items: SDK do frontend +
  Identificador do dispositivo).

## Edge Functions

* `create-mercado-pago-payment`: cria pedido `pending_payment`, cria pagamento
  Pix/cartao no Mercado Pago via fetch raw e salva em `order_payments`.
* `get-mercado-pago-payment`: consulta pagamento no MP e sincroniza status.
* `webhook-mercado-pago`: recebe notificacoes, valida assinatura, atualiza pedido.

### Incompatibilidade de SDK no backend

`npm:mercadopago` e `https://esm.sh/mercadopago` sao incompativeis com o
bundler do Supabase/Deno. Usar `fetch` raw para chamar a API do MP e suficiente
e recomendado.

## Payload de pagamento (campos obrigatorios)

```
transaction_amount, description, statement_descriptor: 'Cosechas',
payment_method_id, external_reference, additional_info.items[],
payer.{ email, first_name, last_name, identification },
notification_url
```

Para cartao: tambem `token`, `installments`, `issuer_id` (se disponivel).

## Status de pedido

| Evento | orders.status | orders.payment_status |
|---|---|---|
| Criado | pending_payment | pending |
| Aprovado | new | paid |
| Recusado/cancelado | payment_failed | failed |
| Pendente | pending_payment | pending |

## Avaliar Qualidade (resultado)

* Score obtido: **92/100** (2026-06-05, producao).
* Threshold necessario para cartao em producao: 73.
* Para reavaliar: usar payment ID de pagamento com **cartao de credito** real
  (nao Pix). Checks de SDK do frontend e Identificador do dispositivo so
  passam com tokenizacao de cartao.

## Pendencias

* A definir: politica de estorno/refund.
* A definir: expiracao operacional de Pix pendente (pg_cron configurado para
  40 minutos).

## Historico de atualizacao

* 2026-06-03: decisao atualizada para Mercado Pago Checkout Transparente.
* 2026-06-05: adicionados Secure Fields, device fingerprinting, regras de
  producao, resultado Avaliar Qualidade 92/100, incompatibilidade SDK/Deno.
* 2026-06-13: explicitado uso de `security.js` para gerar o device session id.
* 2026-06-13: cartao passou a exigir CPF, aguardar device id e usar email real
  do usuario no payload antifraude.
* 2026-06-13: removido `security.js` de `index.html`; carregamento passou a ser
  dinamico via `loadMercadoPagoSecurity()` para garantir contexto de checkout
  correto e eliminar `security:none` no tracking_id do Mercado Pago.
* 2026-06-14: adicionado atributo `public_key` ao script de security.js —
  obrigatorio para que o MP registre o fingerprint no backend e preencha o
  elemento DOM de saida. Confirmado funcionando em producao.
