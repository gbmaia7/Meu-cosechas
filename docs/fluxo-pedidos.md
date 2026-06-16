# Fluxo de Pedidos

## Objetivo

Documentar o fluxo operacional de pedidos para orientar alteracoes nas telas de
cliente, loja e entregador.

## Contexto

O sistema possui fluxo para cliente criar pedido, loja preparar e entregador
confirmar entrega. O cliente acompanha o pedido em `AcompanharPedido.tsx`.

## Informacoes atuais

### Cliente

1. Cliente escolhe produtos no cardapio.
2. Cliente adiciona itens na sacola.
3. Cliente escolhe modalidade de retirada ou entrega.
4. Cliente escolhe pagamento: Pix (online) ou "Presencial" (dinheiro/cartao,
   decidido no caixa ou na entrega — uma unica opcao no app).
5. Para Pix, pedido e salvo no Supabase como `pending_payment` e navega para
   `/pagamento/pix`. Mercado Pago confirma via webhook/consulta backend;
   pedido muda para `new` e cliente cai em `/pagamento-confirmado`.
6. Para Presencial, pedido ja nasce como `new` com
   `payment_status = pay_on_delivery` e cliente cai em
   `/pagamento-presencial` (tela avisa que so vai preparar apos pagamento no
   caixa, ou que o entregador vai cobrar na entrega).
7. Cliente acompanha status em `/acompanhar-pedido`. Para balcao com
   `payment_status = pay_on_delivery`, a tela mostra "Aguardando pagamento no
   caixa" (em vez do progresso normal de preparo) at o operador confirmar.
8. Em entrega, cliente visualiza o PIN de seguranca.

### Loja

1. Loja acessa `/loja`.
2. Loja visualiza pedidos do dia (Pix ja pago, e balcao/entrega aguardando
   pagamento fisico).
3. Pedidos de balcao "Presencial" aparecem em vermelho na coluna "Novo" —
   loja cobra no caixa (dinheiro ou cartao) e clica "Pago" (credita pontos e
   avanca direto para "Em preparo").
4. Demais pedidos: loja aceita/prepara normalmente.
5. Loja marca pedido como pronto.
6. Para delivery, loja marca como saiu para entrega.
7. Loja nao conclui entrega em rota.

### Entregador

1. Entregador acessa `/entregador`.
2. Entregador visualiza entregas pendentes, em rota e concluidas hoje.
3. Entregador inicia entrega.
4. Ao entregar, digita PIN informado pelo cliente.
5. Backend valida PIN via RPC.
6. Pedido vai para concluidos hoje.

## Pendencias

* Necessita validacao: comportamento quando cliente informa PIN incorreto varias vezes.
* Necessita validacao: fluxo de pedido sem usuario autenticado.
* A definir: notificacoes ao cliente.
* A definir: regra de expiracao do PIN.

## Historico de atualizacao

* 2026-06-03: template inicial criado com fluxo observado no sistema.
* 2026-06-03: atualizado fluxo online para Mercado Pago com `pending_payment`.
* 2026-06-16: cartao online removido; balcao com dinheiro/maquininha exige
  confirmacao manual ("Pago") na loja antes de entrar em preparo.
* 2026-06-16: unificada escolha dinheiro/maquininha em "Presencial"; nova
  tela `/pagamento-presencial` separada de `/pagamento-confirmado` (Pix).
* 2026-06-16: `AcompanharPedido.tsx` ganhou estado "Aguardando pagamento no
  caixa" para balcao com `payment_status = pay_on_delivery`; terminologia de
  pagamento padronizada para "no caixa" (era "no balcao").
* 2026-06-16: identificadas telas `PagamentoVR.tsx`/`PagamentoConfirmadoVR.tsx`
  (rotas `/pagamento/vr`, `/pagamento-confirmado-vr`) como codigo morto — nada
  navega para elas. Nao removidas nesta tarefa; avaliar remocao depois.
