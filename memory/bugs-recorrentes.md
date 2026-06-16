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
* Correcao: (1) remover `security.js` de `index.html`; (2) carregar DINAMICAMENTE
  em `loadMercadoPagoSecurity()` com `view="checkout"`, `output="mp-device-session-id"`
  E `public_key` no script tag. Sem `public_key`, o script gera ID local mas nao
  registra o fingerprint no backend do MP — elemento DOM nunca e preenchido.
* Prevencao: NUNCA colocar `security.js` em `index.html`. Sempre incluir `view`,
  `output` E `public_key` ao carregar dinamicamente.
* Status: corrigido em 2026-06-14. Confirmado funcionando em producao.
* Observacao: fluxo de cartao online foi removido em 2026-06-16; manter este
  registro apenas como historico para evitar reintroduzir Secure Fields sem
  revisao completa.

### Pix Orders API sem QR na tela

* Bug: tela `/pagamento/pix` abria sem QR Code e sem codigo Pix copia-e-cola.
* Local: `supabase/functions/create-mercado-pago-payment/index.ts`,
  `supabase/functions/get-mercado-pago-payment/index.ts`,
  `src/screens/PagamentoPix.tsx`.
* Causa: a Orders API retornou `qr_code`, `qr_code_base64` e `ticket_url`
  diretamente em `transactions.payments[0].payment_method`, mas o backend
  procurava apenas em `payment_method.transaction_data` ou
  `point_of_interaction.transaction_data`.
* Prevencao: sempre testar a resposta real salva em `order_payments.raw_response`
  ao alterar payload Mercado Pago; manter extracao tolerante para os caminhos
  conhecidos.
* Status: corrigido em 2026-06-16.

### Pix Orders API rejeitando `bank_transfer`

* Bug: Mercado Pago retornava `property_value` dizendo que
  `payment_method.type = 'bank_transfer'` era invalido.
* Local: `supabase/functions/create-mercado-pago-payment/index.ts`.
* Causa: payload Pix enviava `capture_mode: 'automatic'`, campo de cartao que
  fazia o validador da Orders API cair em schema de cartao.
* Prevencao: payload Pix nao deve enviar `capture_mode`; esse campo pertence ao
  fluxo de cartao.
* Status: corrigido e Edge Function deployada em 2026-06-16.

### Codigo falso na confirmacao do pedido

* Bug: tela `pagamento-confirmado` exibia `#82931`, divergindo do codigo visto
  pela loja/acompanhamento, como `C-008`.
* Local: `src/screens/PagamentoConfirmado.tsx`, `src/screens/AcompanharPedido.tsx`,
  `src/screens/PagamentoConfirmadoVR.tsx`.
* Causa: codigo hardcoded de preview permaneceu em telas de producao.
* Prevencao: telas de pedido devem exibir `pickup_code`/codigo operacional
  quando existir; buscar por numeros fixos antes de release.
* Status: corrigido em 2026-06-16.

### Codigo tecnico na entrega presencial

* Bug: tela `pagamento-presencial` para entrega exibia fallback tecnico como
  `#4ea42fef`, divergindo do codigo operacional visto pela loja/acompanhamento,
  como `C-009`.
* Local: `src/context/CartContext.tsx`, `src/screens/PagamentoPresencial.tsx`,
  `supabase/functions/create-mercado-pago-payment/index.ts`.
* Causa: geracao de `pickup_code` estava limitada a pedidos de balcao.
* Prevencao: todo pedido operacional deve receber `pickup_code` no formato
  `C-000`; fallback tecnico deve ser usado apenas para pedido antigo sem codigo.
* Status: corrigido em 2026-06-16.

### PIN vazando em mensagem para entregador

* Bug: template do WhatsApp "Falar com o entregador" incluia o PIN de
  seguranca do cliente.
* Local: `src/screens/AcompanharPedido.tsx`.
* Causa: mensagem de contato reutilizava `delivery_pin` como identificador do
  pedido.
* Prevencao: PIN so deve ser informado ao entregador no momento da entrega; para
  contato via WhatsApp usar produto, codigo operacional e endereco.
* Status: corrigido em 2026-06-16.

## Pendencias

* A definir: politica de regressao visual para telas internas.
* Necessita validacao: cobertura automatizada para fluxo de entrega.
