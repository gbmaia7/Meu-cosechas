# Pagamentos Mercado Pago

## Objetivo

Registrar a decisao e o fluxo oficial de pagamentos do Meu-Cosechas com
Mercado Pago, mantendo a experiencia dentro do app.

## Decisao (2026-06-16): cartao saiu do fluxo digital

* Cartao de credito/debito online (Checkout Transparente, Secure Fields, 3DS,
  cartoes salvos) foi **removido**. Motivo: custo de engenharia recorrente
  (antifraude, 3DS, idempotencia, bugs de SDK) para um fluxo que pode ser
  resolvido com maquininha fisica, como a maioria dos pequenos negocios.
* **Pix continua 100% automatico** via Mercado Pago (sem mudanca).
* Cartao/dinheiro passam a ser pagos fisicamente (maquininha ou caixa) com
  confirmacao manual:
  * **Balcao**: pedido nasce em `new` (coluna "Novo" da loja) com
    `payment_status = 'pay_on_delivery'` e aparece destacado em vermelho. O
    operador cobra no caixa e clica "Pago" — isso credita os pontos do Clube
    Cosechas (`credit_order_points`) e avanca o pedido para "Preparando" com
    `payment_status = 'paid'` (vira verde) em uma unica acao.
  * **Entrega**: pedido segue o fluxo normal de preparo/pronto/saiu para
    entrega sem gate de pagamento (o entregador ja esta comprometido a
    entregar). O entregador cobra na entrega e confirma com o PIN de
    seguranca; isso credita os pontos (`Entregador.tsx` -> RPC
    `credit_order_points`), sem mudanca nesse fluxo.
* Telas/rotas removidas: `NovoCartao.tsx`, `GerenciarCartoes.tsx`,
  `useSecureCardFields.ts`, rotas `/pagamento/cartao` e `/perfil/cartoes`,
  Edge Functions `save-card` e `delete-card`, SDK `sdk.mercadopago.com/js/v2`
  (`index.html`), singleton `window.__mpGlobal` (`App.tsx`).
* `VITE_MERCADO_PAGO_PUBLIC_KEY` deixou de ser necessaria no frontend (nao ha
  mais tokenizacao de cartao). Pode ser removida do Vercel quando conveniente.
* Resultado "Avaliar Qualidade" (92/100, 2026-06-05) ficou obsoleto para
  cartao — nao se aplica mais, pois nao ha mais pagamento de cartao online.

### Ajuste (2026-06-16): "Dinheiro" e "Maquininha" virou uma opcao so

* `Pagamento.tsx` tinha dois botoes (Dinheiro, Maquininha) que faziam a mesma
  coisa no backend. Unificados em um unico botao "Pagar no balcao"/"Pagar na
  entrega" que envia `payment_method: 'cash'` (valor unico daqui pra frente;
  `'machine'` continua valido no banco so para pedidos antigos).
* Texto do botao e da tela seguinte deixam explicito que, no balcao, o pedido
  so entra em preparo depois do pagamento confirmado no caixa (ver botao
  "Pago" em `Loja.tsx`). Na entrega, o preparo comeca normalmente e o
  entregador cobra na hora.
* Nova tela `src/screens/PagamentoPresencial.tsx` (rota `/pagamento-presencial`)
  para pedidos pagos no balcao/entrega — substitui o uso de
  `/pagamento-confirmado` para esse caso. `PagamentoConfirmado.tsx` agora e
  exclusivo do Pix (cabecalho "Pagamento confirmado!" so faz sentido quando o
  pagamento ja aconteceu).
* Labels `cash` em `Loja.tsx`/`Entregador.tsx` renomeados de "Dinheiro" para
  "Presencial" (cobre dinheiro ou cartao, decidido na hora pelo cliente).
* Terminologia padronizada para "pagar no caixa" (era "balcao") em todo o
  fluxo de pagamento presencial de balcao — botao em `Pagamento.tsx`, badge
  em `Loja.tsx`, e novo estado "Aguardando pagamento no caixa" em
  `AcompanharPedido.tsx` (substitui a mensagem de "preparando" enquanto
  `payment_status = pay_on_delivery`). `ActiveOrder.payment_status` foi
  adicionado ao `CartContext` para isso funcionar via realtime.

## Contexto

Gateway oficial: Mercado Pago (Orders API), usado apenas para Pix.
InfinitePay e Checkout Pro/link de pagamento permanecem descartados.

## Diretriz principal

* Nao usar Checkout Pro, link de pagamento ou redirecionamento externo.
* `MERCADO_PAGO_ACCESS_TOKEN` somente em Supabase Edge Functions.
* Confirmacao final via webhook ou consulta backend sincronizada.

## Variaveis de ambiente

Backend/Supabase Edge Functions (todas obrigatorias):

* `MERCADO_PAGO_ACCESS_TOKEN`
* `MERCADO_PAGO_WEBHOOK_SECRET`
* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`

## Fluxo Pix

1. Frontend envia payload para `create-mercado-pago-payment` (sem token, sem
   SDK frontend).
2. Edge Function cria order Pix via fetch raw na Orders API e retorna
   `qr_code` e `ticket_url`.
3. Frontend exibe QR e/ou copia-e-cola.
4. Webhook ou polling via `get-mercado-pago-payment` atualiza status.

Importante: payload Pix da Orders API nao envia `capture_mode`. Esse campo e
especifico do fluxo de cartao e faz o validador rejeitar
`payment_method.type = 'bank_transfer'`. A resposta Pix pode trazer
`qr_code`, `qr_code_base64` e `ticket_url` diretamente em
`transactions.payments[0].payment_method`.

### Email do pagador Pix

O MP rejeita quando o email do pagador e igual ao email do recebedor. Solucao:
usar alias `cliente{userId_slice}@meucosechas.app` para pagamentos Pix.

## Edge Functions

* `create-mercado-pago-payment`: cria pedido `pending_payment`, cria pagamento
  Pix no Mercado Pago via fetch raw e salva em `order_payments`.
* `get-mercado-pago-payment`: consulta pagamento no MP e sincroniza status.
* `webhook-mercado-pago`: recebe notificacoes, valida assinatura, atualiza
  pedido (generico — funciona para qualquer `payment_method`, sem logica
  especifica de cartao).

### Incompatibilidade de SDK no backend

`npm:mercadopago` e `https://esm.sh/mercadopago` sao incompativeis com o
bundler do Supabase/Deno. Usar `fetch` raw para chamar a API do MP e suficiente
e recomendado.

## Status de pedido

| Evento | orders.status | orders.payment_status |
|---|---|---|
| Criado (Pix) | pending_payment | pending |
| Aprovado (Pix) | new | paid |
| Recusado/cancelado | payment_failed | failed |
| Balcao, aguardando pagamento no caixa | new | pay_on_delivery |
| Balcao, pagamento confirmado pelo operador | preparing | paid |
| Entrega, paga na entrega | new/preparing/ready/out_for_delivery | pay_on_delivery |
| Entrega, confirmada com PIN | delivered | pay_on_delivery (pontos ja creditados) |

## Pendencias

* A definir: politica de estorno/refund (Pix).
* A definir: expiracao operacional de Pix pendente (pg_cron configurado para
  40 minutos).

## Historico de atualizacao

* 2026-06-03: decisao atualizada para Mercado Pago Checkout Transparente.
* 2026-06-05: adicionados Secure Fields, device fingerprinting, regras de
  producao, resultado Avaliar Qualidade 92/100, incompatibilidade SDK/Deno.
* 2026-06-13: explicitado uso de `security.js` para gerar o device session id.
* 2026-06-13: cartao passou a exigir CPF, aguardar device id e usar email real
  do usuario no payload antifraude.
* 2026-06-13: removido `security.js` de `index.html`; carregamento passou a ser
  dinamico via `loadMercadoPagoSecurity()` para garantir contexto de checkout
  correto e eliminar `security:none` no tracking_id do Mercado Pago.
* 2026-06-14: adicionado atributo `public_key` ao script de security.js —
  obrigatorio para que o MP registre o fingerprint no backend e preencha o
  elemento DOM de saida. Confirmado funcionando em producao.
* 2026-06-16: migrado para Orders API com 3DS 2.0 (commit c72f514).
* 2026-06-16: **cartao removido do fluxo digital** — Pix-only via app; cartao
  fisico (maquininha) com confirmacao manual no balcao/entrega.
* 2026-06-16: unificado Dinheiro/Maquininha em uma opcao ("Presencial",
  `payment_method: 'cash'`); criada tela `PagamentoPresencial.tsx` separada
  de `PagamentoConfirmado.tsx` (que ficou exclusiva do Pix).
