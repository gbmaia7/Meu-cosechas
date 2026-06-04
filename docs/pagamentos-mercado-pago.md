# Pagamentos Mercado Pago

## Objetivo

Registrar a decisao e o fluxo oficial de pagamentos do Meu-Cosechas com
Mercado Pago Checkout Transparente, mantendo a experiencia dentro do app.

## Contexto

Decisao tecnica atual: nao usar InfinitePay porque o fluxo direciona o cliente
para checkout externo/hospedado. O gateway oficial passa a ser Mercado Pago com
checkout transparente/in-app.

## Informacoes atuais

### Diretriz principal

* Nao usar Checkout Pro, link de pagamento ou redirecionamento externo.
* Usar Public Key somente no frontend.
* Usar Access Token somente em Supabase Edge Functions.
* Tokenizar cartao no frontend com MercadoPago.js antes de chamar o backend.
* Confirmacao final deve vir por webhook ou consulta backend sincronizada.

### Variaveis

Frontend Vite:

* `VITE_MERCADO_PAGO_PUBLIC_KEY`

Backend/Supabase Edge Functions (todas obrigatorias):

* `MERCADO_PAGO_ACCESS_TOKEN`
* `MERCADO_PAGO_WEBHOOK_SECRET` — obrigatorio; ausencia retorna 500 e rejeita webhook
* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `APP_URL`

### Edge Functions

* `create-mercado-pago-payment`: cria pedido `pending_payment`, cria pagamento
  Pix/cartao no Mercado Pago e salva referencia em `order_payments`.
* `get-mercado-pago-payment`: consulta pagamento no Mercado Pago e sincroniza
  `orders.payment_status` e `orders.status`.
* `webhook-mercado-pago`: recebe notificacoes, valida assinatura quando segredo
  estiver configurado, consulta o pagamento na API e atualiza o pedido.

### Status

* Pedido antes do pagamento: `pending_payment`.
* Pagamento aprovado: `payment_status = paid` e `status = new`.
* Pagamento recusado/cancelado: `payment_status = failed` e
  `status = payment_failed`.
* Pagamento pendente: permanece `pending_payment`.

## Pendencias

* Necessita validacao: credenciais reais de teste Mercado Pago.
* Necessita validacao: payload final de webhook no ambiente configurado.
* Necessita validacao: politica de estorno/refund.
* A definir: expiracao operacional de Pix pendente.

## Historico de atualizacao

* 2026-06-03: decisao atualizada para Mercado Pago Checkout Transparente.
