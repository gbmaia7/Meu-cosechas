# Deploy e Operacoes

## Visao geral da infraestrutura

| Camada | Provedor | Trigger de deploy |
| --- | --- | --- |
| Frontend | Vercel | Push para `main` (automatico) |
| Edge Functions | Supabase | Manual via MCP ou CLI |
| Banco de dados | Supabase | Manual via MCP ou CLI |

---

## Ordem de deploy

Sempre respeitar esta ordem quando houver mudancas em mais de uma camada:

```
1. Banco (migrations)
2. Edge Functions
3. Frontend (git push → Vercel)
```

**Motivo:** o frontend depende das Edge Functions, que dependem do banco. Deployar na ordem inversa causa janela de indisponibilidade.

---

## Como deployar cada camada

### Banco de dados

**Via MCP (preferencial para mudancas pontuais):**
```
apply_migration (project_id, name, query)
```

**Via CLI:**
```bash
supabase db push --project-ref hfpqynfqtgpnvaopstun
```

Os arquivos de migration ficam em `supabase/migrations/` com prefixo de timestamp.

### Edge Functions

**Via MCP:**
```
deploy_edge_function (project_id, name, files, verify_jwt)
```

**Via CLI:**
```bash
supabase functions deploy <nome-da-funcao> --project-ref hfpqynfqtgpnvaopstun
```

Funcoes disponiveis: `create-mercado-pago-payment`, `get-mercado-pago-payment`, `webhook-mercado-pago`.

### Frontend

```bash
git push origin main
```

Vercel detecta o push e inicia o deploy automaticamente. Aguardar o build concluir antes de validar.

**Secrets necessarios no Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MERCADO_PAGO_PUBLIC_KEY`

---

## Secrets obrigatorios antes do primeiro deploy em producao

| Secret | Onde configurar | Status |
| --- | --- | --- |
| `MERCADO_PAGO_ACCESS_TOKEN` | Supabase Edge Functions Secrets | Configurado (sandbox) |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Supabase Edge Functions Secrets | Configurado |
| `SUPABASE_URL` | Auto-injetado pela Supabase | OK |
| `SUPABASE_ANON_KEY` | Auto-injetado pela Supabase | OK |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injetado pela Supabase | OK |
| `VITE_SUPABASE_URL` | Vercel Environment Variables | A configurar |
| `VITE_SUPABASE_ANON_KEY` | Vercel Environment Variables | A configurar |
| `VITE_MERCADO_PAGO_PUBLIC_KEY` | Vercel Environment Variables | A configurar (producao) |

Ao trocar para credenciais de producao do Mercado Pago, atualizar `MERCADO_PAGO_ACCESS_TOKEN` no Supabase e `VITE_MERCADO_PAGO_PUBLIC_KEY` no Vercel.

---

## Rollback

### Frontend

Vercel mantem todas as versoes anteriores.

1. Acessar Vercel Dashboard → projeto → Deployments
2. Localizar o ultimo deploy estavel
3. Clicar em "..." → **Promote to Production**

### Edge Functions

Cada funcao tem versoes anteriores no Supabase. Para reverter:

1. Localizar o codigo anterior (Git ou `supabase/functions/`)
2. Redeploy via MCP ou CLI com o codigo antigo
3. Validar o comportamento apos o redeploy

### Banco de dados

Migrations sao permanentes por padrao. Para reverter:

**Mudancas nao-destrutivas** (ADD COLUMN, CREATE TABLE, CREATE FUNCTION):
- Escrever e aplicar uma migration reversa (`DROP COLUMN`, `DROP TABLE`, `DROP FUNCTION`)

**Mudancas destrutivas** (DROP COLUMN, DROP TABLE):
- Nunca aplicar sem backup verificado
- Restaurar via Supabase Dashboard → Backups (disponivel no plano Pro)

**Regra pratica:** se a migration pode ser revertida com um DROP simples e sem perda de dados, e segura. Se envolve remocao de dados, exige plano de backup antes.

---

## Checklist pre-deploy em producao

Antes de qualquer deploy em producao:

- [ ] `npm run lint` sem erros
- [ ] `npm run build` sem erros
- [ ] Migrations testadas em sandbox antes de aplicar em producao
- [ ] Secrets de producao configurados (MP Access Token real, nao TEST-)
- [ ] Webhook URL do Mercado Pago apontando para a URL de producao
- [ ] Fluxo Pix testado manualmente apos o deploy
- [ ] Rollback planejado para cada camada alterada

---

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
* 2026-06-04: processo completo documentado com ordem de deploy, rollback e checklist.
