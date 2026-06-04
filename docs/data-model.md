# Modelo de Dados

## Objetivo

Registrar entidades, relacionamentos e regras de negocio relacionadas aos
dados.

## Entidades observadas

### `profiles`

Representa usuarios e informacoes de perfil.

Campos relevantes observados: `id`, `name`, `email`, `phone`,
`phone_verified`, `role`, `points`, `total_orders`.

### `addresses`

Representa enderecos de entrega.

Campos relevantes observados: `user_id`, `label`, `block`, `room`,
`complement`, `is_default`.

### `orders`

Representa pedidos.

Campos relevantes observados: `user_id`, `subtotal`, `total_price`, `status`,
`payment_method`, `payment_status`, `modality`, `pickup_code`, `delivery_pin`.

### `order_items`

Representa itens de pedido.

Campos relevantes observados: `order_id`, `product_id`, `product_name`,
`unit_price`, `quantity`, `size_label`, `base`, `notes`, `points_cost`,
`is_reward`.

### `order_payments`

Representa pagamentos externos associados ao pedido.

Campos relevantes observados: `order_id`, `provider`, `provider_payment_id`,
`provider_status`, `payment_method`, `amount`, `qr_code`, `qr_code_base64`,
`ticket_url`.

### `payment_webhook_events`

Representa eventos recebidos de provedores de pagamento.

## Relacionamentos

* `profiles` 1:N `orders`.
* `profiles` 1:N `addresses`.
* `orders` 1:N `order_items`.
* `order_items` 1:N `order_item_extras`.
* `orders` 1:N `order_payments`.
* `orders` 1:N `order_status_events`.

## Regras relacionadas aos dados

* Pedido online inicia como `pending_payment`.
* Pedido aprovado pelo Mercado Pago muda para `new`.
* Pedido pendente de pagamento nao deve aparecer na loja/entregador.
* Entrega usa PIN validado no backend.
* PIN claro nao deve ser exposto para loja/entregador.

## Pendencias

* Necessita validacao: diagrama ER completo.
* Necessita validacao: tabelas completas do Clube Cosechas.
* A definir: estrategia de arquivamento de pedidos antigos.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
