# Testes e Qualidade

## Objetivo

Definir estrategia de testes, criterios de aceitacao e fluxo minimo de
validacao para mudancas no Meu-Cosechas.

## Contexto

Scripts observados:

* `npm run lint`: executa `tsc --noEmit`.
* `npm run build`: executa build Vite.

Nao foi observado script automatizado de testes unitarios/e2e.

## Estrategia de testes

* Mudancas de TypeScript: rodar `npm run lint`.
* Mudancas de frontend: rodar `npm run build` e validacao visual/manual.
* Mudancas de pagamento: testar aprovado, pendente e recusado com mocks ou
  sandbox.
* Mudancas de banco: validar SQL em ambiente seguro antes de producao.
* Mudancas de PIN/entrega: validar PIN correto, PIN incorreto e permissao.

## Testes obrigatorios

* Pagamento Pix: QR/copia-e-cola, status pendente e aprovado.
* Pagamento cartao: tokenizacao, aprovado, recusado.
* Webhook: idempotencia e nao regressao de status.
* Loja: pedido nao pago nao deve aparecer.
* Entregador: entrega so conclui com PIN validado no backend.

## Cobertura minima

* A definir: ferramenta de teste.
* A definir: percentual de cobertura.
* Necessita validacao: suite e2e para fluxo completo de pedido.

## Criterios de aceitacao

* Build e typecheck passam.
* Fluxo principal funciona manualmente ou via teste.
* Regressao relevante foi verificada.
* Riscos e pendencias foram documentados.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
