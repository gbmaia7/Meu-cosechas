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
4. Cliente escolhe pagamento.
5. Pedido e salvo no Supabase quando aplicavel.
6. Cliente acompanha status.
7. Em entrega, cliente visualiza o PIN de seguranca.

### Loja

1. Loja acessa `/loja`.
2. Loja visualiza pedidos do dia.
3. Loja aceita/prepara pedido.
4. Loja marca pedido como pronto.
5. Para delivery, loja marca como saiu para entrega.
6. Loja nao conclui entrega em rota.

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
