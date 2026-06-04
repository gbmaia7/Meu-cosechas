# Ambientes

## Objetivo

Registrar ambientes, variaveis necessarias e diferencas operacionais.

## Local

* Frontend: `npm run dev`.
* URL padrao observada: `http://localhost:3000`.
* Variaveis locais: `.env`.
* Necessita validacao: Supabase local ou projeto remoto para desenvolvimento.

## Desenvolvimento

* A definir: URL.
* A definir: projeto Supabase.
* A definir: credenciais Mercado Pago de teste.

## Staging

* A definir: URL.
* A definir: projeto Supabase dedicado.
* A definir: webhook Mercado Pago sandbox.

## Producao

* A definir: URL final.
* Necessita validacao: secrets finais.
* Necessita validacao: dominio configurado no Mercado Pago.

## Variaveis necessarias

Frontend:

* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `VITE_MERCADO_PAGO_PUBLIC_KEY`

Backend/Supabase Edge Functions:

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `MERCADO_PAGO_ACCESS_TOKEN`
* `MERCADO_PAGO_WEBHOOK_SECRET`
* `APP_URL`

## Diferencas entre ambientes

* A definir: chaves de teste vs producao.
* A definir: dados seed/demo por ambiente.
* A definir: politicas de logs.

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
