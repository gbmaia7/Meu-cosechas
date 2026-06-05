# Seguranca

## Objetivo

Registrar principios, requisitos minimos e checklist de seguranca para orientar
alteracoes no Meu-Cosechas.

## Contexto

React/Vite no frontend, Supabase para autenticacao, banco, RLS e Edge Functions.
Pagamentos via Mercado Pago Checkout Transparente com Secure Fields.

## Principios de seguranca

* Menor privilegio para usuarios, policies e secrets.
* Secrets nunca devem ser expostos no frontend.
* Dados sensiveis de cartao nao devem passar pelo backend: Secure Fields
  garantem que o numero do cartao vai diretamente do browser para o MP.
* Validacoes criticas devem ocorrer no backend.
* Webhooks devem ser validados e tratados de forma idempotente.
* Alteracoes em pagamentos, pedidos e PIN de entrega exigem revisao especifica.

## Secrets e variaveis de ambiente

| Variavel | Onde fica | Observacao |
|---|---|---|
| `VITE_MERCADO_PAGO_PUBLIC_KEY` | Vercel env vars | Obrigatoria para Secure Fields |
| `VITE_SUPABASE_URL` | Vercel env vars | Publica, safe |
| `VITE_SUPABASE_ANON_KEY` | Vercel env vars | Publica, safe |
| `MERCADO_PAGO_ACCESS_TOKEN` | Supabase secrets | Nunca no frontend |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Supabase secrets | Nunca no frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Nunca no frontend |

**Regra:** qualquer variavel com prefixo `VITE_` e embutida no bundle e
visivel publicamente. Nunca colocar `ACCESS_TOKEN`, `SERVICE_ROLE_KEY` ou
`WEBHOOK_SECRET` com prefixo `VITE_`.

## SDK MercadoPago e Secure Fields

* Dados de cartao nunca transitam pelo backend do app.
* O MP processa a tokenizacao dentro de iframes hospedados no dominio do MP.
* Instancia unica do SDK via `window.__mpGlobal`. Multiplas instancias podem
  comprometer o isolamento dos campos.
* `overflow: hidden` nos containers dos campos pode expor o usuario a campos
  nao interativos (falha silenciosa no iOS). Evitar.

## Autenticacao e autorizacao

* Autenticacao: Supabase Auth.
* Autorizacao: `profiles.role` com `customer`, `store`, `admin`.
* Acesso de loja/entregador por `has_store_access()`.
* Pendencia: route guards para `/loja` e `/entregador` no frontend.
* Pendencia: separar papel `delivery` de `store`.

## Validacao de inputs

* Validar payloads de Edge Functions antes de chamar APIs externas.
* Validar `order_id`, status e permissao antes de atualizar pedidos.
* Validar PIN de entrega no backend.
* Pendente: politica contra tentativas repetidas de PIN incorreto.

## Protecao contra ataques comuns

* Exposicao de secrets: ACCESS_TOKEN nunca no frontend.
* Reenvio de webhook: usar idempotencia; nao regredir status operacional.
* Manipulacao de pedido: criar/atualizar pedido por backend confiavel quando
  envolver pagamento.
* Enumeracao de pedidos: depende de RLS e filtros por usuario/role.
* XSS/HTML injection: nao renderizar HTML vindo de usuario sem sanitizacao.

## Checklist de seguranca

* Secrets aparecem apenas onde deveriam?
* Dados sensiveis de cartao sao tokenizados via Secure Fields?
* Webhook tem validacao de assinatura e idempotencia?
* Usuarios sem permissao conseguem acessar loja/entregador?
* Pedido `pending_payment` fica oculto da operacao?
* Logs evitam dados sensiveis (numero de cartao, token, CPF)?
* RLS cobre novas tabelas?
* `VITE_MERCADO_PAGO_PUBLIC_KEY` esta configurada no Vercel?

## Pendencias

* Necessita validacao: matriz formal de permissoes por rota.
* Route guards frontend para `/loja` e `/entregador`.
* A definir: processo de resposta a incidente.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
* 2026-06-05: adicionadas regras de Secure Fields, singleton SDK, tabela de
  secrets com observacoes, regra VITE_ no checklist.
