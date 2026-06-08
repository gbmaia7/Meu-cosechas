# Modelo de Dados

## Objetivo

Registrar entidades, relacionamentos e regras de negocio relacionadas aos dados.

## Entidades observadas

### `profiles`

Representa usuarios e informacoes de perfil.

Campos relevantes: `id`, `name`, `email`, `phone`, `phone_verified`, `role`,
`points`, `total_orders`, `mp_customer_id` (ID do cliente no Mercado Pago,
usado para salvar cartoes).

### `addresses`

Representa enderecos de entrega.

Campos relevantes: `user_id`, `label`, `block`, `room`, `complement`,
`is_default`.

### `orders`

Representa pedidos.

Campos relevantes: `user_id`, `subtotal`, `total_price`, `status`,
`payment_method`, `payment_status`, `modality`, `pickup_code`, `delivery_pin`.

### `order_items`

Representa itens de pedido.

Campos relevantes: `order_id`, `product_id`, `product_name`, `unit_price`,
`quantity`, `size_label`, `base`, `notes`, `points_cost`, `is_reward`.

### `order_item_extras`

Representa adicionais de itens de pedido.

Campos relevantes: `order_item_id`, `extra_id`, `extra_name`, `extra_price`.

### `order_payments`

Representa pagamentos externos associados ao pedido.

Campos relevantes: `order_id`, `provider`, `provider_payment_id`,
`provider_status`, `payment_method`, `amount`, `qr_code`, `qr_code_base64`,
`ticket_url`, `raw_response`.

### `saved_cards`

Representa cartoes salvos pelo usuario no Mercado Pago.

Campos relevantes: `id`, `user_id`, `mp_card_id`, `brand`, `last_four`,
`holder_name`, `exp_month`, `exp_year`.

### `payment_webhook_events`

Representa eventos recebidos de provedores de pagamento.

### `counter_sale_point_events`

Representa eventos de compras de balcao enviados pelo Teknisa para credito de
pontos do Clube Cosechas por telefone.

Campos propostos: `source`, `external_sale_id`, `store_id`, `phone_e164`,
`user_id`, `amount`, `points`, `status`, `paid_at`, `expires_at`,
`claimed_at`, `cancelled_at`, `raw_payload`.

Status propostos: `pending`, `claimed`, `expired`, `cancelled`.

## Relacionamentos

* `profiles` 1:N `orders`.
* `profiles` 1:N `addresses`.
* `profiles` 1:N `saved_cards`.
* `profiles` 1:N `counter_sale_point_events` (quando telefone ja foi
  vinculado a usuario).
* `orders` 1:N `order_items`.
* `order_items` 1:N `order_item_extras`.
* `orders` 1:N `order_payments`.
* `orders` 1:N `order_status_events`.

## Regras relacionadas aos dados

* Pedido online inicia como `pending_payment`.
* Pedido aprovado pelo Mercado Pago muda para status `new`.
* Pedido pendente de pagamento nao deve aparecer na loja/entregador.
* Pedidos `pending_payment` expiram apos 40 minutos (pg_cron).
* Entrega usa PIN validado no backend; PIN claro nao e exposto para
  loja/entregador.
* `provider_payment_id` em `order_payments` e o ID do pagamento no MP
  (usado para Avaliar Qualidade e consultas).
* Eventos Teknisa devem ser idempotentes por `external_sale_id`.
* Creditos pendentes por telefone devem expirar; sugestao inicial: 45 dias para
  claim e limpeza fisica apos 90 dias de expirado.

## Pendencias

* Necessita validacao: diagrama ER completo.
* Necessita validacao: tabelas completas do Clube Cosechas.
* Necessita validacao: aplicar migration `20260608143000_create_counter_sale_point_events.sql`
  em producao.
* A definir: estrategia de arquivamento de pedidos antigos.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
* 2026-06-05: adicionadas tabelas `saved_cards`, `order_item_extras`, campo
  `mp_customer_id` em profiles, campo `raw_response` em order_payments,
  regra de expiracao de pedidos pendentes (40 min).
* 2026-06-08: adicionada proposta de modelo para eventos de compras de balcao
  via Teknisa.
* 2026-06-08: modelo implementado localmente em migration versionada.
