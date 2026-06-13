# Bugs Recorrentes

Registrar bugs recorrentes, causa provavel, prevencao e status.

## Registro

### PIN visivel para loja/entregador

* Bug: PIN de entrega aparecia para loja e entregador.
* Local: `src/screens/Loja.tsx`, `src/screens/Entregador.tsx`.
* Causa: telas internas buscavam/renderizavam `delivery_pin`.
* Prevencao: nao selecionar `delivery_pin` em telas internas; validar entrega por RPC.
* Status: corrigido em 2026-06-03.

### Pedido desaparece apos confirmar entrega

* Bug: apos confirmar PIN correto, pedido saia da lista sem feedback claro.
* Local: `src/screens/Entregador.tsx`.
* Causa: tela filtrava apenas `ready` e `out_for_delivery`.
* Prevencao: incluir aba de concluidos hoje e modal de sucesso/erro.
* Status: corrigido em 2026-06-03.

### Cartao recusado por alto risco no Mercado Pago

* Bug: pagamento com cartao em producao podia retornar "Pagamento recusado ou cancelado".
* Evidencia: `order_payments.raw_response.status_detail = cc_rejected_high_risk`.
* Local: `index.html`, `src/screens/Pagamento.tsx`, Edge Function `create-mercado-pago-payment`.
* Causa provavel: device fingerprint ausente/intermitente quando `security.js` do Mercado Pago nao era carregado explicitamente.
* Prevencao: manter `https://www.mercadopago.com/v2/security.js` com `view="checkout"`, aguardar `MP_DEVICE_SESSION_ID`, enviar `X-meli-session-id`, usar CPF e email real em cartao.
* Status: mitigado em 2026-06-13; recusa antifraude ainda pode ocorrer por decisao do Mercado Pago/cartao.

## Pendencias

* A definir: politica de regressao visual para telas internas.
* Necessita validacao: cobertura automatizada para fluxo de entrega.
