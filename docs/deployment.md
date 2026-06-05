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

**Motivo:** o frontend depende das Edge Functions, que dependem do banco.

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

### Edge Functions

**Via CLI (preferencial — MCP pode dar 502 esporadicamente):**
```bash
npx supabase functions deploy <nome> --project-ref hfpqynfqtgpnvaopstun
```

Funcoes disponiveis:
* `create-mercado-pago-payment`
* `get-mercado-pago-payment`
* `webhook-mercado-pago`
* `save-card`

**Atencao:** `npm:mercadopago` e `esm.sh/mercadopago` sao incompativeis com
o bundler do Supabase/Deno. Usar fetch raw para chamar a API do MP.

### Frontend

```bash
git push origin main
```

Vercel detecta o push e inicia o deploy automaticamente. Aguardar ~2 minutos
antes de validar.

---

## Secrets e variaveis de ambiente

### Vercel (Frontend)

| Variavel | Status | Observacao |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Configurado | |
| `VITE_SUPABASE_ANON_KEY` | Configurado | |
| `VITE_MERCADO_PAGO_PUBLIC_KEY` | **Configurado** | Chave publica producao `APP_USR-...`. Obrigatoria para Secure Fields. Sem ela os campos de cartao ficam vazios. |

### Supabase Edge Functions Secrets

| Secret | Status | Observacao |
| --- | --- | --- |
| `MERCADO_PAGO_ACCESS_TOKEN` | Configurado (producao) | Chave de producao |
| `MERCADO_PAGO_WEBHOOK_SECRET` | Configurado | |
| `SUPABASE_URL` | Auto-injetado | |
| `SUPABASE_ANON_KEY` | Auto-injetado | |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injetado | |

---

## Rollback

### Frontend

Vercel mantem todas as versoes anteriores:
1. Vercel Dashboard → projeto → Deployments
2. Localizar o ultimo deploy estavel
3. Clicar em "..." → **Promote to Production**

### Edge Functions

1. Localizar o codigo anterior no Git
2. Redeploy via CLI com o codigo antigo
3. Validar apos o redeploy

### Banco de dados

Migrations sao permanentes. Para reverter:
* **Nao-destrutivas** (ADD COLUMN, CREATE TABLE): escrever migration reversa.
* **Destrutivas** (DROP): nunca aplicar sem backup verificado. Restaurar via
  Supabase Dashboard → Backups (plano Pro).

---

## Checklist pre-deploy em producao

- [ ] `npm run lint` sem erros
- [ ] `npm run build` sem erros
- [ ] Migrations testadas antes de aplicar em producao
- [ ] `VITE_MERCADO_PAGO_PUBLIC_KEY` configurada no Vercel (chave producao)
- [ ] `MERCADO_PAGO_ACCESS_TOKEN` e chave de producao (nao `TEST-`)
- [ ] Webhook URL do Mercado Pago apontando para URL de producao
- [ ] Fluxo Pix testado manualmente apos o deploy
- [ ] Fluxo cartao testado manualmente (Secure Fields interagiveis)
- [ ] Rollback planejado para cada camada alterada

---

## Historico de atualizacao

* 2026-06-03: documento inicial criado.
* 2026-06-04: processo completo documentado.
* 2026-06-05: atualizados status de secrets (todos producao), adicionada
  observacao critica sobre VITE_MERCADO_PAGO_PUBLIC_KEY, incompatibilidade
  npm:mercadopago/Deno, funcao save-card.
