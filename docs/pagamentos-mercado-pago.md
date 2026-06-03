# Pagamentos

## Objetivo

Registrar integracoes e regras de pagamento. O nome do arquivo referencia
Mercado Pago por solicitacao, mas a integracao observada no projeto atualmente
e InfinitePay.

## Contexto

O codigo atual possui Edge Functions relacionadas a InfinitePay:

* `supabase/functions/create-infinite-checkout/index.ts`
* `supabase/functions/verify-infinite-payment/index.ts`
* `supabase/functions/webhook-infinitepay/index.ts`

Nao foi encontrada integracao Mercado Pago no codigo auditado.

## Informacoes atuais

### InfinitePay

* Checkout criado por Edge Function `create-infinite-checkout`.
* Verificacao de pagamento por `verify-infinite-payment`.
* Webhook recebido em `webhook-infinitepay`.
* Variaveis observadas:
  * `INFINITEPAY_HANDLE`
  * `APP_URL`
  * `SUPABASE_URL`

### Mercado Pago

* A definir.
* Necessita validacao: confirmar se Mercado Pago sera usado no futuro ou se o
  nome deste arquivo deve ser migrado para `pagamentos-infinitepay.md`.

## Pendencias

* Necessita validacao: gateway oficial de pagamento.
* Necessita validacao: fluxo completo de webhook e reconciliacao.
* Necessita validacao: tratamento de falha, estorno e pagamentos pendentes.
* A definir: politica de auditoria financeira.

## Historico de atualizacao

* 2026-06-03: template inicial criado; observado uso de InfinitePay, nao Mercado Pago.
