# Decisoes de Negocio

Registrar decisoes de negocio, produto e operacao.

## Registro

### 2026-06-03

* Decisao: PIN de entrega deve aparecer somente para o cliente.
* Motivo: seguir fluxo operacional similar a marketplaces de entrega, com validacao no momento da entrega.
* Impacto no produto: loja e entregador nao visualizam o PIN; entregador digita o PIN informado pelo cliente.

### 2026-06-03

* Decisao: tela do entregador deve manter aba de pedidos concluidos do dia.
* Motivo: evitar que pedido desapareca sem feedback apos conclusao.
* Impacto no produto: entregador ve abas de pendentes, em rota e concluidos hoje.

### 2026-06-08

* Decisao: compras de balcao poderao gerar pontos do Clube Cosechas pelo
  telefone informado no Teknisa.
* Motivo: permitir que clientes que compram no caixa participem do Clube sem
  precisar fazer o pedido pelo app.
* Impacto no produto: se o telefone ja estiver verificado, pontos entram na
  hora; se nao estiver, ficam pendentes por prazo limitado ate verificacao.

### 2026-06-16

* Decisao: no app, pagamento digital fica restrito a Pix; cartao, dinheiro e VR
  sao pagamentos presenciais.
* Motivo: simplificar operacao e reduzir risco/custo tecnico de pagamento de
  cartao online para um negocio de pequeno porte.
* Impacto no produto: clientes escolhem Pix no app ou "Pagar no caixa/na
  entrega"; loja confirma pagamento presencial no balcao pelo botao "Pago"; no
  delivery, o entregador cobra e confirma a entrega com PIN.

### 2026-06-16

* Decisao: codigo exibido ao cliente deve ser o mesmo codigo operacional visto
  pela loja e no acompanhamento do pedido.
* Motivo: evitar divergencia entre tela de confirmacao, loja e atendimento.
* Impacto no produto: telas de confirmacao usam `pickup_code` quando existir
  (ex.: `C-008`) e so usam fallback tecnico se o pedido ainda nao tiver codigo.

### 2026-06-16

* Decisao: pedido de balcao com pagamento presencial expira em 5 minutos se a
  loja nao confirmar o pagamento no caixa.
* Motivo: evitar que pedidos nao pagos fiquem ocupando o painel da loja e sejam
  preparados por engano.
* Impacto no produto: pedidos `counter` com `status = new` e
  `payment_status = pay_on_delivery` viram `cancelled` +
  `payment_status = failed` automaticamente apos 5 minutos; a acao manual
  "Pago" so avanca se o pedido ainda estiver pendente.

## Pendencias

* Necessita validacao: regra para tentativa repetida de PIN errado.
* A definir: indicadores operacionais para entregas concluidas.
* Definir prazo final de validade dos creditos pendentes de compras de balcao.
