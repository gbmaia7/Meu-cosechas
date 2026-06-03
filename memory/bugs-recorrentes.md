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

## Pendencias

* A definir: politica de regressao visual para telas internas.
* Necessita validacao: cobertura automatizada para fluxo de entrega.
