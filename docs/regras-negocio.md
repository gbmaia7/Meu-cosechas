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
* Status observados: `new`, `preparing`, `ready`, `out_for_delivery`,
  `delivered`, `cancelled` e variantes legadas.
* Retirada no balcao usa `pickup_code`.
* Entrega usa PIN de seguranca exibido ao cliente e validado no backend.
* Loja nao deve visualizar PIN de entrega.
* Entregador deve digitar o PIN informado pelo cliente para concluir entrega.

### Pagamento

* Formas observadas: Pix, cartao de credito/debito via checkout, dinheiro,
  maquininha e VR/VA.
* Pagamentos em dinheiro/maquininha/VR podem ser tratados como
  `pay_on_delivery`.

### Clube Cosechas

* Existe conceito de pontos, assinatura e resgate.
* A regra detalhada de pontuacao necessita validacao.

## Pendencias

* Necessita validacao: regra completa de cancelamento.
* Necessita validacao: regra de estorno/refund.
* Necessita validacao: validade dos pontos do Clube Cosechas.
* A definir: SLA de preparo e entrega.
* A definir: regra para multiplos pedidos simultaneos por cliente.

## Historico de atualizacao

* 2026-06-03: template inicial criado com regras observadas no codigo.
