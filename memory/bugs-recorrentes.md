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

* Bug: pagamento com cartao em producao retornava `cc_rejected_high_risk` com
  `tracking_id: security:none` mesmo quando `device_session_id` era enviado.
* Evidencia: `order_payments.raw_response.status_detail = cc_rejected_high_risk`,
  `tracking_id` contendo `security:none`, `metadata.app_has_device_session_id: true`.
* Local: `index.html` (causa raiz), `src/screens/Pagamento.tsx`.
* Causa raiz confirmada (2026-06-13): `security.js` carregado em `index.html` gerava
  o device session ID na abertura do app (contexto de browse). `loadMercadoPagoSecurity()`
  retornava early porque `window.MP_DEVICE_SESSION_ID` ja estava setado. O MP recebia
  o ID mas nao encontrava dados de fingerprint de checkout associados → `security:none`.
* Correcao: remover `security.js` de `index.html`. O script agora e carregado
  DINAMICAMENTE em `loadMercadoPagoSecurity()` quando o usuario seleciona cartao,
  com `view="checkout"` e `output="mp-device-session-id"` no contexto correto.
* Prevencao: NUNCA colocar `security.js` em `index.html` nem em qualquer pagina que
  nao seja o checkout de cartao. O device session ID deve ser gerado no contexto real
  de checkout para ser reconhecido pelo antifraude do MP.
* Status: corrigido em 2026-06-13.

## Pendencias

* A definir: politica de regressao visual para telas internas.
* Necessita validacao: cobertura automatizada para fluxo de entrega.
