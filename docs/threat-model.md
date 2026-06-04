# Threat Model

## Objetivo

Mapear ativos criticos, superficies de ataque, ameacas, impactos e mitigacoes
para orientar revisoes de seguranca.

## Ativos criticos

* Dados de usuarios: nome, email, telefone, endereco.
* Pedidos: itens, status, modalidade, endereco, pagamento.
* PIN de entrega.
* Credenciais e roles de usuarios internos.
* Secrets Supabase e Mercado Pago.
* Webhooks de pagamento.
* Ledger/pontos do Clube Cosechas.

## Superficies de ataque

* Frontend React/Vite.
* Supabase Auth.
* Policies RLS no banco.
* Edge Functions.
* Webhooks Mercado Pago.
* Rotas internas `/loja` e `/entregador`.
* Arquivos `.env` e secrets de deploy.

## Ameacas identificadas

| Ameaca | Impacto | Mitigacao atual/esperada | Status |
| --- | --- | --- | --- |
| Expor Access Token no frontend | Criacao/consulta indevida de pagamentos | Usar Access Token apenas em Edge Functions | Em andamento |
| Pedido nao pago aparecer na loja | Preparo indevido e perda operacional | `pending_payment` oculto da loja por RLS e filtro de app | Implementado |
| Reenvio de webhook regredir pedido | Pedido em preparo voltar para novo | Atualizacao segura sem regressao operacional | Em andamento |
| Webhook sem secret aceitar qualquer POST | Alteracao de status de pedido por terceiros | MERCADO_PAGO_WEBHOOK_SECRET obrigatorio no env da Edge Function | Implementado |
| PIN visivel para loja/entregador | Fraude na confirmacao de entrega | PIN apenas para cliente, validacao por RPC | Implementado |
| Usuario sem role acessar operacao | Vazamento de pedidos | `has_store_access()` e tela com login | Necessita validacao |
| Logs com dados sensiveis | Vazamento de PII/secrets | A definir politica de logs | A definir |

## Mitigacoes prioritarias

* Revisar RLS para `orders`, `order_payments` e `payment_webhook_events`.
* Validar assinatura do webhook Mercado Pago no ambiente real.
* Criar testes de regressao para pagamento e PIN.
* Separar papel de entregador, se necessario.

## Pendencias

* Necessita validacao: inventario completo de dados pessoais.
* Necessita validacao: configuracao final de webhook Mercado Pago.
* A definir: classificacao formal de severidade.

## Historico de atualizacao

* 2026-06-03: threat model inicial criado.
* 2026-06-04: RLS orders_store_select e orders_store_update atualizados para filtrar status != pending_payment no banco (migration fix_rls_store_pending_payment).
