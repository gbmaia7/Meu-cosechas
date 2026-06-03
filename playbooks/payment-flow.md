# Playbook: Fluxo de Pagamento

## Objetivo

Orientar alteracoes relacionadas a pagamento, checkout, confirmacao e webhooks.

## Quando usar

Use para tarefas em:

* `src/screens/Pagamento.tsx`
* `src/screens/PagamentoPix.tsx`
* `src/screens/PagamentoVR.tsx`
* `src/screens/ValidandoPagamento.tsx`
* `src/screens/PagamentoConfirmado*.tsx`
* `supabase/functions/create-infinite-checkout`
* `supabase/functions/verify-infinite-payment`
* `supabase/functions/webhook-infinitepay`

## Passos

1. Ler `docs/pagamentos-mercado-pago.md`.
2. Confirmar gateway envolvido.
3. Identificar se a mudanca afeta:
   * calculo de total
   * taxa de entrega
   * cupom/desconto
   * status de pagamento
   * criacao do pedido
   * webhook/verificacao
4. Evitar expor chaves ou dados sensiveis.
5. Validar fluxo feliz e falhas.
6. Rodar `npm run lint` e `npm run build`.
7. Atualizar documentacao e pendencias.

## Cuidados

* Nao assumir Mercado Pago: o codigo atual observado usa InfinitePay.
* Nao alterar valores financeiros sem rastrear origem.
* Nao criar pedido duplicado em callbacks de pagamento.

## Pendencias

* Necessita validacao: regra oficial de reconciliacao de pagamento.
* A definir: testes de webhook.
