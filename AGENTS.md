# Memoria Operacional para Agentes

Este arquivo e o ponto de entrada para agentes de IA no projeto Meu-Cosechas.
Ele complementa as skills e a documentacao, sem substituir instrucoes especificas
do usuario ou o codigo-fonte.

## Visao Geral

Meu-Cosechas e uma aplicacao React/Vite para cardapio, sacola, pagamentos,
acompanhamento de pedidos, operacao de loja, entregador e Clube Cosechas.
O backend observado usa Supabase, tabelas SQL, RLS, RPCs e Edge Functions.

## Ordem de Prioridade

1. Codigo-fonte
2. Solicitacoes explicitas do usuario
3. AGENTS.md
4. CLAUDE.md
5. Skills
6. Docs
7. Memory

## Fontes Oficiais

Produto:
docs/produto.md

Visao:
docs/vision.md

Arquitetura:
docs/arquitetura.md

Regras de negocio:
docs/regras-negocio.md

Pagamentos:
docs/pagamentos-mercado-pago.md

Fluxo de pedidos:
docs/fluxo-pedidos.md

## Processo Antes de Implementar

1. Entender a tarefa.
2. Ler apenas os arquivos necessarios.
3. Consultar documentacao relevante.
4. Verificar decisoes anteriores.
5. Criar plano.
6. Executar.

IMPORTANTE:

Nao carregar toda a documentacao.
Ler apenas os arquivos relacionados a tarefa atual.

## Politica de Atualizacao

Atualizar documentacao sempre que:

* regras de negocio mudarem
* arquitetura mudar
* fluxo de pedidos mudar
* integracao de pagamento mudar

Atualizar memoria sempre que:

* decisoes importantes forem tomadas
* bugs recorrentes forem descobertos
* pendencias forem criadas ou resolvidas

## Relacao com Skills

* Skills existentes permanecem validas.
* Nao alterar skills sem autorizacao.
* Utilizar skills quando fizer sentido.
* O AGENTS.md complementa as skills.
* O AGENTS.md nao substitui as skills.

## Praticas Herdadas do Workflow Atual

Antes de mudancas relevantes:

* usar recon do codigo quando o contexto nao estiver claro
* identificar arquitetura, arquivos impactados e riscos
* criar plano antes de implementar
* preferir a menor mudanca funcional
* evitar refactors nao relacionados
* rodar lint, build e testes quando disponiveis
* revisar o diff antes de finalizar
