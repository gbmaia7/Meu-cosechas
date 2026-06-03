# Playbook: Implementar Funcionalidade

## Objetivo

Padronizar o fluxo de implementacao de funcionalidades no Meu-Cosechas.

## Quando usar

Use quando a tarefa alterar comportamento, tela, fluxo de pedido, regras de
negocio ou integracao.

## Passos

1. Entender a solicitacao.
2. Identificar arquivos impactados.
3. Ler apenas:
   * codigo diretamente relacionado
   * docs relevantes
   * decisoes em `memory/` relacionadas
4. Verificar riscos e conflitos com trabalho nao commitado.
5. Criar plano curto.
6. Implementar menor mudanca funcional.
7. Rodar verificacoes:
   * `npm run lint`
   * `npm run build`
   * testes especificos, se existirem
8. Revisar diff.
9. Atualizar `docs/` ou `memory/` se a regra mudou.
10. Reportar arquivos alterados, validacao e riscos.

## Checklist

* [ ] Escopo entendido.
* [ ] Arquivos relevantes lidos.
* [ ] Sem refactor nao relacionado.
* [ ] Documentacao/memoria atualizada quando necessario.
* [ ] Verificacao executada.

## Pendencias

* A definir: incluir checklist de QA visual por tela.
