# Seguranca

## Objetivo

Registrar principios, requisitos minimos e checklist de seguranca para orientar
alteracoes no Meu-Cosechas.

## Contexto

O projeto usa React/Vite no frontend, Supabase para autenticacao, banco,
politicas RLS e Edge Functions. Pagamentos online usam Mercado Pago Checkout
Transparente, com Public Key no frontend e Access Token somente no backend.

## Principios de seguranca

* Menor privilegio para usuarios, policies e secrets.
* Secrets nunca devem ser expostos no frontend.
* Dados sensiveis de cartao nao devem passar pelo backend sem tokenizacao.
* Validacoes criticas devem ocorrer no backend.
* Webhooks devem ser validados e tratados de forma idempotente.
* Alteracoes em pagamentos, pedidos e PIN de entrega exigem revisao especifica.

## Requisitos minimos

* `VITE_MERCADO_PAGO_PUBLIC_KEY` pode ser usada no frontend.
* `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` e
  `SUPABASE_SERVICE_ROLE_KEY` devem existir somente como secrets de backend.
* Operacoes de loja e entregador devem depender de permissao por perfil.
* PIN de entrega deve aparecer somente para o cliente.
* Conclusao de entrega deve usar validacao backend.

## Gestao de secrets

* Local: usar `.env` local, nao versionado.
* Exemplo: manter apenas placeholders em `.env.example`.
* Producao: configurar secrets no provedor de deploy/Supabase.
* A definir: rotacao periodica de secrets.

## Autenticacao e autorizacao

* Autenticacao observada: Supabase Auth.
* Autorizacao observada: `profiles.role` com `customer`, `store`, `admin`.
* Acesso de loja/entregador observado por `has_store_access()`.
* Necessita validacao: separar papel `delivery` de `store`.

## Validacao de inputs

* Validar payloads de Edge Functions antes de chamar APIs externas.
* Validar `order_id`, status e permissao antes de atualizar pedidos.
* Validar PIN de entrega no backend.
* Necessita validacao: politica contra tentativas repetidas de PIN incorreto.

## Protecao contra ataques comuns

* Exposicao de secrets: bloquear Access Token no frontend.
* Reenvio de webhook: usar idempotencia e nao regredir status operacional.
* Manipulacao de pedido: criar/atualizar pedido por backend confiavel quando
  envolver pagamento.
* Enumeracao de pedidos: depender de RLS e filtros por usuario/role.
* XSS/HTML injection: nao renderizar HTML vindo de usuario sem sanitizacao.

## Checklist de seguranca

* Secrets aparecem apenas onde deveriam?
* Dados sensiveis de cartao sao tokenizados?
* Webhook tem validacao e idempotencia?
* Usuarios sem permissao conseguem acessar loja/entregador?
* Pedido pendente de pagamento fica oculto da operacao?
* Logs evitam dados sensiveis?
* RLS cobre novas tabelas?

## Pendencias

* Necessita validacao: matriz formal de permissoes por rota.
* Necessita validacao: politica de retencao de logs.
* A definir: processo de resposta a incidente.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
