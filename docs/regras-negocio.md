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

* Formas observadas: Pix (online, automatico via Mercado Pago) e "Presencial"
  (dinheiro ou cartao na maquininha, decidido na hora, `payment_method: 'cash'`).
  Cliente nao escolhe mais dinheiro x maquininha no app — uma opcao so. Cartao
  online foi removido em 2026-06-16 — ver `docs/pagamentos-mercado-pago.md`.
* Pagamentos em dinheiro/maquininha/VR sao tratados como `pay_on_delivery`
  ate a confirmacao manual.
* Confirmacao final de Pix deve vir de webhook ou consulta backend ao
  Mercado Pago.
* Balcao com dinheiro/maquininha: pedido entra como `new` +
  `pay_on_delivery`; loja so credita pontos e avanca para `preparing` depois
  que o operador clicar "Pago" (apos cobrar no caixa).
* Entrega com dinheiro/maquininha: pedido segue preparo normalmente; pontos
  so sao creditados quando o entregador confirma com o PIN de seguranca.

### Clube Cosechas

* Existe conceito de pontos, assinatura e resgate.
* Compras de balcao enviadas pelo Teknisa podem gerar pontos pelo telefone do
  cliente.
* Se o telefone ja pertencer a usuario verificado, os pontos sao creditados
  imediatamente.
* Se o telefone ainda nao estiver verificado no app, os pontos ficam pendentes
  por prazo limitado e sao creditados apos verificacao do telefone.
* Creditos pendentes de compras de balcao devem expirar para evitar crescimento
  indefinido de dados.
* A regra detalhada de pontuacao necessita validacao.

## Expiracao de pedidos

* Pedidos em `pending_payment` ha mais de 40 minutos sao marcados como `expired` + `payment_status = failed`.
* Job pg_cron `expire-pending-payment-orders` roda a cada 5 minutos.
* Se webhook do Mercado Pago chegar apos expiracao, o pedido pode ser aprovado (MP e fonte de verdade).

## Pendencias

* Necessita validacao: regra completa de cancelamento.
* Necessita validacao: regra de estorno/refund.
* Necessita validacao: validade dos pontos do Clube Cosechas.
* Necessita validacao: prazo final de expiracao dos creditos pendentes Teknisa
  (sugestao inicial: 45 dias).
* A definir: SLA de preparo e entrega.
* A definir: regra para multiplos pedidos simultaneos por cliente.

## Historico de atualizacao

* 2026-06-03: template inicial criado com regras observadas no codigo.
* 2026-06-08: adicionada politica de taxa de entrega por subtotal.
* 2026-06-08: adicionada regra proposta para pontos de compras de balcao via
  Teknisa.
* 2026-06-16: removido cartao online; balcao com dinheiro/maquininha passa a
  exigir confirmacao manual ("Pago") antes de creditar pontos e preparar.
* 2026-06-16: unificada a escolha dinheiro/maquininha em uma opcao
  "Presencial" no app.
