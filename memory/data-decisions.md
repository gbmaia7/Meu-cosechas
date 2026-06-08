# Decisoes de Dados

Registrar decisoes de modelagem e mudancas estruturais.

## Registro

### 2026-06-03

* Decisao: criar `order_payments` para separar dados de pagamento do pedido.
* Motivo: pedidos podem ter lifecycle operacional diferente do lifecycle do
  provedor de pagamento.
* Impacto: Mercado Pago salva `provider_payment_id`, status externo e dados de
  Pix sem acoplar tudo em `orders`.
* Arquivos afetados: `supabase/mercado_pago_payments.sql`.

### 2026-06-03

* Decisao: criar `payment_webhook_events` para auditoria de webhooks.
* Motivo: webhooks podem ser reenviados, falhar ou chegar fora de ordem.
* Impacto: eventos ficam rastreaveis e podem ser reconciliados.
* Arquivos afetados: `supabase/mercado_pago_payments.sql`,
  `supabase/functions/webhook-mercado-pago/index.ts`.

### 2026-06-08

* Decisao: modelar compras de balcao do Teknisa como eventos idempotentes por
  `external_sale_id`, com status `pending`, `claimed`, `expired` ou
  `cancelled`.
* Motivo: evitar duplicidade de pontos, permitir claim posterior por telefone e
  manter trilha de auditoria.
* Impacto: sera necessaria tabela para eventos de venda de balcao e rotina de
  expiracao/limpeza de creditos pendentes.
* Arquivos afetados: `docs/integracao-teknisa.md`, `docs/data-model.md`.

## Pendencias

* A definir: padrao de migrations versionadas.
* Necessita validacao: politica de retencao de eventos de webhook.
* Definir migration da tabela `counter_sale_point_events`.
