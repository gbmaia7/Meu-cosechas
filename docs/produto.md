# Produto

## Objetivo

Documentar o escopo funcional observado do Meu-Cosechas e manter uma fonte
oficial para agentes consultarem antes de alterar comportamento de produto.

## Contexto

O produto permite navegar pelo cardapio, montar sacola, escolher modalidade,
realizar pagamento, acompanhar pedido, operar pedidos pela loja e confirmar
entregas pelo entregador.

## Informacoes atuais

* Cardapio: `src/data/products.ts`.
* Home/cardapio: `src/screens/HomeMenu/`.
* Sacola: `src/screens/Sacola.tsx`.
* Pagamento: `src/screens/Pagamento.tsx`, `PagamentoPix.tsx`, `PagamentoVR.tsx`.
* Confirmacao: `PagamentoConfirmado.tsx`, `PagamentoConfirmadoVR.tsx`.
* Acompanhamento do cliente: `AcompanharPedido.tsx`.
* Operacao da loja: `Loja.tsx`.
* Operacao do entregador: `Entregador.tsx`.
* Clube Cosechas: telas `ClubeCosechas*`, ledger e pontos observados no contexto.

## Pendencias

* Necessita validacao: nomes oficiais das personas do produto.
* Necessita validacao: regras completas do Clube Cosechas.
* A definir: requisitos de acessibilidade e responsividade por tela.
* A definir: ambientes oficiais de homologacao e producao.

## Historico de atualizacao

* 2026-06-03: template inicial criado com base nos arquivos e fluxos existentes.
