# Testes e Qualidade

## Objetivo

Definir estrategia de testes, criterios de aceitacao e fluxo minimo de
validacao para mudancas no Meu-Cosechas.

## Scripts disponiveis

* `npm run lint`: executa `tsc --noEmit`.
* `npm run build`: executa build Vite.
* Nao ha testes automatizados unitarios/e2e no momento.

## Estrategia de testes

* Mudancas de TypeScript: rodar `npm run lint`.
* Mudancas de frontend: rodar `npm run build` e validacao visual/manual.
* Mudancas de pagamento: testar aprovado, pendente e recusado.
* Mudancas de banco: validar SQL antes de producao.
* Mudancas de PIN/entrega: validar PIN correto, incorreto e permissao.

## Testes obrigatorios

* Pagamento Pix: QR/copia-e-cola, status pendente e aprovado.
* Pagamento cartao: Secure Fields interagiveis, tokenizacao, aprovado, recusado.
* Webhook: idempotencia e nao regressao de status.
* Loja: pedido nao pago nao deve aparecer.
* Entregador: entrega so conclui com PIN validado no backend.

## Testes de Secure Fields (cartao)

* Verificar que os tres campos (numero, validade, CVV) recebem input.
* Se os campos estiverem vazios/nao interagindo: verificar no console se
  aparece `[useSecureCardFields] VITE_MERCADO_PAGO_PUBLIC_KEY nao esta definida`.
* Se sim: adicionar `VITE_MERCADO_PAGO_PUBLIC_KEY` nas env vars do Vercel e
  redesploiar.
* Em producao usar cartao real. Cartoes de teste (ex: `5031 4332 1540 6351`)
  so funcionam com credenciais sandbox (`TEST-...`).

## Avaliar Qualidade Mercado Pago

Score atual: **92/100** (2026-06-05). Threshold para cartao em producao: 73.

Para reavaliar:
1. Fazer pagamento com cartao de credito real em producao.
2. Buscar o `provider_payment_id` na tabela `order_payments`.
3. Submeter em: Mercado Pago Dashboard → Desenvolvedor → Avaliar integracao.

**Importante:** submeter payment ID de **cartao de credito** (nao Pix).
Os checks "SDK do frontend" e "Identificador do dispositivo" so passam com
tokenizacao de cartao via Secure Fields. Pix nao satisfaz esses checks.

## Cobertura minima

* A definir: ferramenta de teste (Vitest sugerido para unitarios).
* A definir: percentual de cobertura.
* Pendente: suite e2e para fluxo completo de pedido.

## Criterios de aceitacao

* Build e typecheck passam.
* Fluxo principal funciona manualmente.
* Regressao relevante foi verificada.
* Riscos e pendencias documentados.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
* 2026-06-05: adicionados testes de Secure Fields, instrucoes de Avaliar
  Qualidade MP (92/100), regra de cartao real em producao.
