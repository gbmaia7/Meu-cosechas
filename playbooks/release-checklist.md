# Playbook: Checklist de Release

## Objetivo

Checklist operacional antes de publicar alteracoes em producao.

## Ordem de deploy

```
1. Banco (supabase/migrations/)
2. Edge Functions (supabase/functions/)
3. Frontend (git push → Vercel)
```

## Pre-deploy

* [ ] `npm run lint` sem erros
* [ ] `npm run build` sem erros
* [ ] Migrations em `supabase/migrations/` revisadas e testadas em sandbox
* [ ] Edge Functions revisadas (sem segredo exposto, sem Access Token no frontend)
* [ ] Secrets de producao configurados no Supabase e no Vercel
* [ ] `MERCADO_PAGO_ACCESS_TOKEN` e `VITE_MERCADO_PAGO_PUBLIC_KEY` sao das credenciais de PRODUCAO (APP_USR-), nao de teste (TEST-)
* [ ] `MERCADO_PAGO_WEBHOOK_SECRET` configurado no Supabase
* [ ] Webhook URL no painel Mercado Pago aponta para o endpoint de producao
* [ ] RLS de novas tabelas revisada

## Deploy

* [ ] Migrations aplicadas (`supabase db push` ou MCP)
* [ ] Edge Functions deployadas (`supabase functions deploy` ou MCP)
* [ ] Frontend deployado (`git push origin main` → aguardar Vercel)

## Pos-deploy

* [ ] Fluxo Pix testado manualmente (gerar QR, aguardar status)
* [ ] Webhook recebendo e processando (checar `payment_webhook_events` no banco)
* [ ] Loja nao exibe pedidos `pending_payment`
* [ ] Entrega com PIN funciona corretamente
* [ ] Logs de Edge Functions sem erros 5xx

## Rollback

| Camada | Como reverter |
| --- | --- |
| Frontend | Vercel Dashboard → Deployments → Promote versao anterior |
| Edge Function | Redeploy com codigo anterior via MCP ou CLI |
| Migration nao-destrutiva | Aplicar migration reversa (DROP do que foi adicionado) |
| Migration destrutiva | Restaurar backup (Supabase Dashboard → Backups) |

## Bloqueios de release

* Secret ausente ou incorreto (TEST- em producao)
* Webhook URL errada ou secret nao configurado
* Pedido nao pago visivel na loja
* Erro de build ou lint
* Migration destrutiva sem backup verificado
* Fluxo Pix sem teste end-to-end pos-deploy

## Historico

* 2026-06-03: template inicial.
* 2026-06-04: processo detalhado com ordem, rollback e bloqueios especificos.
