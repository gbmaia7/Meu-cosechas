# Autenticacao e Permissoes

## Objetivo

Documentar autenticacao, tipos de usuario e permissoes observadas no projeto.

## Contexto

O projeto usa Supabase Auth e tabela `profiles`. O campo `profiles.role` foi
observado com os valores `customer`, `store` e `admin`.

## Tipos de usuario

| Tipo | Descricao | Status |
| --- | --- | --- |
| `customer` | Cliente final do app | Observado |
| `store` | Usuario interno com acesso a loja/entregador | Observado |
| `admin` | Usuario interno com acesso ampliado | Observado |
| `delivery` | Entregador — acesso restrito a entregas do dia | Implementado |

## Permissoes observadas

| Area | Customer | Store | Admin | Observacao |
| --- | --- | --- | --- | --- |
| Cardapio e sacola | Sim | Necessita validacao | Necessita validacao | Frontend publico |
| Criar pedido | Sim | Necessita validacao | Necessita validacao | Online exige auth no novo fluxo Mercado Pago |
| Acompanhar pedido proprio | Sim | Necessita validacao | Necessita validacao | Necessita validar RLS |
| Loja | Nao | Sim | Sim | Controlado por role |
| Entregador | Nao | Sim | Sim | Atualmente usa o mesmo acesso da loja |
| Confirmar entrega por PIN | Nao | Sim | Sim | Via RPC backend |

## Autenticacao

* Supabase Auth e usado para login/cadastro.
* Sessao e carregada no `CartContext` e telas internas.
* Necessita validacao: fluxos de recuperacao, verificacao de email/telefone e
  estados de sessao expirados.

## Autorizacao

* Funcao `has_store_access()` permite role `store` ou `admin`.
* Policies RLS observadas para loja e pagamentos.
* `orders_store_select` e `orders_store_update` filtram `status != pending_payment` no RLS (migration 2026-06-04).
* Necessita validacao: policies completas de cliente em `orders`, `addresses`
  e tabelas de clube.

## RBAC/ABAC

* RBAC parcial por `profiles.role`.
* ABAC nao observado.
* A definir: separar entregador de loja com role propria ou atributo de equipe.

## Pendencias

* Necessita validacao: matriz completa de rotas protegidas.
* Necessita validacao: acesso de anonimos a pedidos locais.
* A definir: processo para conceder/remover roles internas.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
