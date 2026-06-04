# Banco de Dados

## Objetivo

Documentar banco utilizado, estrutura geral, migrations, backups e integridade.

## Banco utilizado

* Supabase/PostgreSQL.
* RLS observado em tabelas operacionais.
* Scripts SQL observados na pasta `supabase/`.

## Estrutura geral observada

* `profiles`
* `addresses`
* `orders`
* `order_items`
* `order_item_extras`
* `order_status_events`
* `order_payments`
* `payment_webhook_events`
* Tabelas do Clube Cosechas: Necessita validacao.

## Migrations

### Padrao oficial (a partir de 2026-06-04)

* Migrations de schema ficam em `supabase/migrations/` com prefixo de timestamp (`YYYYMMDDHHMMSS_nome.sql`).
* Scripts de demo e seed ficam em `supabase/seeds/`.
* Toda migration e registrada no Supabase via MCP (`apply_migration`) ou CLI (`supabase db push`).
* O historico de migrations e rastreado pelo Supabase em `supabase_migrations.schema_migrations`.

### Migrations rastreadas

As 18 migrations originais (20260521*) foram aplicadas antes do rastreamento local.
As migrations a partir de 20260604 possuem arquivo local correspondente em `supabase/migrations/`.

### Para aplicar em novo ambiente

1. Configurar secrets no Supabase (ver `docs/environments.md`).
2. Aplicar migrations em ordem via CLI: `supabase db push`.
3. Executar seeds relevantes manualmente em `supabase/seeds/`.

## Backups

* A definir: politica de backups.
* A definir: retencao.
* Necessita validacao: restore testado.

## Integridade

* `order_items` referencia `orders`.
* `order_item_extras` referencia itens de pedido.
* `order_payments` referencia `orders`.
* `payment_webhook_events` registra eventos externos.
* Necessita validacao: constraints finais para todos os status.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
