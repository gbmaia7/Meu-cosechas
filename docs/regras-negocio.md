# Regras de Negocio

## Objetivo

Centralizar regras de negocio observadas para reduzir regressao em alteracoes
de produto, pedidos, pagamento, clube e entregas.

## Contexto

As regras abaixo foram inferidas a partir do codigo existente. Quando uma regra
nao estiver confirmada por solicitacao explicita do usuario, ela deve ser
tratada como "Necessita validacao".

## Informacoes atuais

### Pedido

* Pedido pode ser `counter` ou `delivery`.
* Status observados: `pending_payment`, `new`, `preparing`, `ready`,
  `out_for_delivery`, `delivered`, `payment_failed`, `expired`, `cancelled`
  e variantes legadas.
* Pedidos online devem nascer como `pending_payment`.
* Loja e entregador nao devem operar pedido `pending_payment`.
* Pedido online so entra na operacao quando pagamento for aprovado.
* Retirada no balcao usa `pickup_code`.
* Entrega usa PIN de seguranca exibido ao cliente e validado no backend.
* Entrega tem frete gratis para subtotal de produtos maior ou igual a R$20,00.
* Entrega com subtotal abaixo de R$20,00 cobra taxa de R$4,00.
* Em resgates do Clube Cosechas, a elegibilidade de frete usa o valor original
  do produto resgatado mais adicionais, mesmo que o produto seja cobrado como
  gratis.
* Loja nao deve visualizar PIN de entrega.
* Entregador deve digitar o PIN informado pelo cliente para concluir entrega.

### Pagamento

* Formas observadas: Pix, cartao de credito/debito via Mercado Pago Checkout
  Transparente, dinheiro, maquininha e VR/VA.
* Pagamentos em dinheiro/maquininha/VR podem ser tratados como
  `pay_on_delivery`.
* Confirmacao final de Pix/cartao deve vir de webhook ou consulta backend ao
  Mercado Pago.

### Clube Cosechas

* Existe conceito de pontos, assinatura e resgate.
* A regra detalhada de pontuacao necessita validacao.

## Expiracao de pedidos

* Pedidos em `pending_payment` ha mais de 40 minutos sao marcados como `expired` + `payment_status = failed`.
* Job pg_cron `expire-pending-payment-orders` roda a cada 5 minutos.
* Se webhook do Mercado Pago chegar apos expiracao, o pedido pode ser aprovado (MP e fonte de verdade).

## Pendencias

* Necessita validacao: regra completa de cancelamento.
* Necessita validacao: regra de estorno/refund.
* Necessita validacao: validade dos pontos do Clube Cosechas.
* A definir: SLA de preparo e entrega.
* A definir: regra para multiplos pedidos simultaneos por cliente.

## Historico de atualizacao

* 2026-06-03: template inicial criado com regras observadas no codigo.
* 2026-06-08: adicionada politica de taxa de entrega por subtotal.
