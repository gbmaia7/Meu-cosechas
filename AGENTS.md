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

Seguranca:
docs/security.md

Threat Model:
docs/threat-model.md

Permissoes:
docs/auth-permissions.md

Privacidade:
docs/data-privacy.md

Testes:
docs/testing.md

Deploy:
docs/deployment.md

Ambientes:
docs/environments.md

Banco:
docs/database.md

Modelo de Dados:
docs/data-model.md

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

Checklist de revisao:

* impacto em seguranca
* impacto em autenticacao
* impacto em permissoes
* exposicao de dados
* impacto em banco de dados
* impacto em deploy
* impacto em ambientes
* cobertura de testes
* risco de regressão


## Agent Operating Principles



\- Entender antes de alterar.

\- Planejar antes de implementar.

\- Preferir simplicidade.

\- Fazer a menor mudança funcional possível.

\- Reutilizar padrões existentes antes de criar novos.

\- Evitar overengineering.

\- Não fazer refactors não relacionados à tarefa.

\- Consultar documentação oficial para APIs, SDKs e bibliotecas externas.

\- Validar impacto em segurança, dados, testes e deploy.

\- Atualizar docs/ e memory/ quando a mudança alterar regras, arquitetura, fluxos, pagamentos, segurança, banco ou decisões importantes.


## Quando Usar Playbooks



\- Para novas features: playbooks/implement-feature.md

\- Para revisão: playbooks/review-code.md

\- Para bugs: playbooks/debug-production.md

\- Para segurança: playbooks/security-review.md

\- Para dependências: playbooks/dependency-audit.md

\- Para pagamentos: playbooks/payment-security.md

\- Para testes: playbooks/test-feature.md e playbooks/regression-check.md

\- Para deploy: playbooks/release-checklist.md


## Skills Obrigatórias e Princípios Herdados



Mesmo quando uma skill não for executada formalmente, seus princípios devem ser aplicados.



\### karpathy-guidelines



Aplicar em toda implementação.



Regras obrigatórias:



\- preferir simplicidade

\- evitar overengineering

\- evitar abstrações prematuras

\- fazer a menor mudança funcional possível

\- reutilizar código existente antes de criar novo

\- entender o fluxo antes de alterar

\- não fazer refactors não relacionados

\- manter código legível e direto



Antes de codar, o agente deve responder internamente:



1\. Esta é a solução mais simples?

2\. Existe implementação parecida no projeto?

3\. Estou criando abstração desnecessária?

4\. Estou alterando mais arquivos do que preciso?



\### codebase-recon



Usar quando:



\- o agente não entender a arquitetura

\- a tarefa envolver área desconhecida

\- houver risco de impacto em múltiplos módulos



Antes de alterar código desconhecido:



\- mapear arquivos relevantes

\- entender fluxo atual

\- identificar dependências

\- só então implementar



\### create-plan



Usar antes de tarefas médias ou grandes.



O plano deve conter:



\- objetivo

\- arquivos prováveis

\- riscos

\- passos de execução

\- validações



\### codex-review



Aplicar antes de finalizar qualquer alteração relevante.



Checklist:



\- mudança mínima?

\- sem overengineering?

\- sem quebra de fluxo existente?

\- segurança revisada?

\- testes/validação definidos?

\- docs/memory atualizados se necessário?



\### openai-docs



Usar documentação oficial quando a tarefa envolver:



\- OpenAI API

\- SDKs

\- modelos

\- integrações externas

\- comportamento que pode ter mudado



\### Regra de Execução



Se uma tarefa envolver código, o agente deve declarar no plano quais princípios/skills serão aplicados.



Exemplo:



"Vou aplicar karpathy-guidelines, codebase-recon e codex-review nesta tarefa."

