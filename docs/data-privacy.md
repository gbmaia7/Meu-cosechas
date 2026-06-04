# Privacidade de Dados

## Objetivo

Registrar dados coletados, dados sensiveis, privacidade, LGPD, retencao e
exclusao de dados.

## Dados coletados observados

* Nome.
* Email.
* Telefone.
* Enderecos de entrega: bloco, sala/quarto, complemento e campos relacionados.
* Historico de pedidos e itens.
* Status de pagamento.
* Pontos e movimentacoes do Clube Cosechas.
* PIN de entrega, com hash no banco e exibicao do PIN somente ao cliente.

## Dados sensiveis

* Dados de contato e endereco sao dados pessoais.
* Access Token Mercado Pago e Service Role Supabase sao secrets.
* Dados de cartao nao devem ser armazenados nem enviados crus ao backend.
* Tokens de cartao Mercado Pago devem ser tratados como dado sensivel
  operacional.

## Retencao

* A definir: prazo de retencao de pedidos.
* A definir: prazo de retencao de logs de webhook.
* A definir: prazo de retencao de enderecos.

## LGPD

* Necessita validacao: base legal para processamento de dados.
* Necessita validacao: processo de exclusao/anonimizacao.
* Necessita validacao: canal para solicitacoes do titular.
* A definir: politica de compartilhamento com terceiros.

## Exclusao de dados

* A definir: exclusao de conta de cliente.
* A definir: anonimizacao de pedidos historicos.
* Necessita validacao: impacto fiscal/operacional antes de excluir pedidos.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
