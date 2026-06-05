# Memoria Operacional — Meu-Cosechas

Este arquivo e o ponto de entrada para agentes de IA no projeto Meu-Cosechas.
Ele complementa as skills e a documentacao, sem substituir instrucoes especificas
do usuario ou o codigo-fonte.

## Visao Geral

Meu-Cosechas e uma aplicacao React/Vite para cardapio, sacola, pagamentos,
acompanhamento de pedidos, operacao de loja, entregador e Clube Cosechas.
O backend usa Supabase, tabelas SQL, RLS, RPCs e Edge Functions.

## Ordem de Prioridade

1. Codigo-fonte
2. Solicitacoes explicitas do usuario
3. AGENTS.md
4. CLAUDE.md
5. Skills
6. Docs
7. Memory

## Fontes Oficiais

| Topico | Arquivo |
|---|---|
| Produto | docs/produto.md |
| Visao | docs/vision.md |
| Arquitetura | docs/arquitetura.md |
| Regras de negocio | docs/regras-negocio.md |
| Pagamentos | docs/pagamentos-mercado-pago.md |
| Fluxo de pedidos | docs/fluxo-pedidos.md |
| Seguranca | docs/security.md |
| Threat Model | docs/threat-model.md |
| Permissoes | docs/auth-permissions.md |
| Privacidade | docs/data-privacy.md |
| Testes | docs/testing.md |
| Deploy | docs/deployment.md |
| Ambientes | docs/environments.md |
| Banco | docs/database.md |
| Modelo de Dados | docs/data-model.md |

**IMPORTANTE:** Nao carregar toda a documentacao. Ler apenas os arquivos relacionados a tarefa atual.

## Processo Antes de Implementar

1. Entender a tarefa
2. Ler apenas os arquivos necessarios
3. Consultar documentacao relevante
4. Verificar decisoes anteriores
5. Criar plano
6. Executar

## Politica de Atualizacao

Atualizar documentacao sempre que:
- regras de negocio mudarem
- arquitetura mudar
- fluxo de pedidos mudar
- integracao de pagamento mudar

Atualizar memoria sempre que:
- decisoes importantes forem tomadas
- bugs recorrentes forem descobertos
- pendencias forem criadas ou resolvidas

## Relacao com Skills

- Skills existentes permanecem validas
- Nao alterar skills sem autorizacao
- Utilizar skills quando fizer sentido
- AGENTS.md complementa as skills, nao as substitui

## Praticas Herdadas do Workflow Atual

Antes de mudancas relevantes:
- usar recon do codigo quando o contexto nao estiver claro
- identificar arquitetura, arquivos impactados e riscos
- criar plano antes de implementar
- preferir a menor mudanca funcional
- evitar refactors nao relacionados
- rodar lint, build e testes quando disponiveis
- revisar o diff antes de finalizar

Checklist de revisao:
- impacto em seguranca
- impacto em autenticacao
- impacto em permissoes
- exposicao de dados
- impacto em banco de dados
- impacto em deploy
- impacto em ambientes
- cobertura de testes
- risco de regressao

## Agent Operating Principles

- Entender antes de alterar
- Planejar antes de implementar
- Preferir simplicidade
- Fazer a menor mudanca funcional possivel
- Reutilizar padroes existentes antes de criar novos
- Evitar overengineering
- Nao fazer refactors nao relacionados a tarefa
- Consultar documentacao oficial para APIs, SDKs e bibliotecas externas
- Validar impacto em seguranca, dados, testes e deploy
- Atualizar docs/ e memory/ quando a mudanca alterar regras, arquitetura, fluxos, pagamentos, seguranca, banco ou decisoes importantes

## Quando Usar Playbooks

| Situacao | Playbook |
|---|---|
| Nova feature | playbooks/implement-feature.md |
| Revisao | playbooks/review-code.md |
| Bug | playbooks/debug-production.md |
| Seguranca | playbooks/security-review.md |
| Dependencias | playbooks/dependency-audit.md |
| Pagamentos | playbooks/payment-security.md |
| Testes | playbooks/test-feature.md e playbooks/regression-check.md |
| Deploy | playbooks/release-checklist.md |

## Skills Obrigatorias e Principios Herdados

Mesmo quando uma skill nao for executada formalmente, seus principios devem ser aplicados.

### karpathy-guidelines

Aplicar em toda implementacao.

Regras obrigatorias:
- preferir simplicidade
- evitar overengineering
- evitar abstracoes prematuras
- fazer a menor mudanca funcional possivel
- reutilizar codigo existente antes de criar novo
- entender o fluxo antes de alterar
- nao fazer refactors nao relacionados
- manter codigo legivel e direto

Antes de codar, responder internamente:
1. Esta e a solucao mais simples?
2. Existe implementacao parecida no projeto?
3. Estou criando abstracao desnecessaria?
4. Estou alterando mais arquivos do que preciso?

### codebase-recon

Usar quando:
- o agente nao entender a arquitetura
- a tarefa envolver area desconhecida
- houver risco de impacto em multiplos modulos

Antes de alterar codigo desconhecido:
- mapear arquivos relevantes
- entender fluxo atual
- identificar dependencias
- so entao implementar

### create-plan

Usar antes de tarefas medias ou grandes.

O plano deve conter:
- objetivo
- arquivos provaveis
- riscos
- passos de execucao
- validacoes

### codex-review

Aplicar antes de finalizar qualquer alteracao relevante.

Checklist:
- mudanca minima?
- sem overengineering?
- sem quebra de fluxo existente?
- seguranca revisada?
- testes/validacao definidos?
- docs/memory atualizados se necessario?

### openai-docs

Usar documentacao oficial quando a tarefa envolver:
- OpenAI API
- SDKs
- modelos
- integracoes externas
- comportamento que pode ter mudado

### Regra de Execucao

Se uma tarefa envolver codigo, o agente deve declarar no plano quais principios/skills serao aplicados.

Exemplo: "Vou aplicar karpathy-guidelines, codebase-recon e codex-review nesta tarefa."
