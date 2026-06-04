# Playbook: Monitoramento de Webhooks e Pagamentos

## Visao rapida (rodar no Supabase SQL Editor)

```sql
select * from public.v_payment_health;
```

Retorna o estado atual em uma linha. Checar diariamente ou apos qualquer deploy.

## Sinais de alerta

| Campo | Valor preocupante | Acao |
| --- | --- | --- |
| `webhooks_assinatura_invalida_24h` | > 0 | Alguem chamando o webhook sem secret correto. Checar `payment_webhook_events` |
| `webhooks_nao_processados_24h` | > 0 | Webhook recebido mas nao processado. Ver detalhes abaixo |
| `pagamentos_falhos_24h` | Alto em relacao ao volume | Credenciais MP ou problema de rede |
| `pending_payment_agora` | > 0 apos 40 min | Cron de expiracao pode nao estar rodando |
| `ultimo_webhook_em` | Muito antigo em dia de movimento | MP pode nao estar enviando webhooks |

## Queries de investigacao

### Ver webhooks com assinatura invalida
```sql
select id, provider_payment_id, event_type, created_at, payload
from public.payment_webhook_events
where signature_valid = false
order by created_at desc
limit 20;
```

### Ver webhooks nao processados
```sql
select id, provider_payment_id, event_type, created_at
from public.payment_webhook_events
where processed_at is null
  and created_at < now() - interval '10 minutes'
order by created_at desc;
```

### Ver pedidos com pagamento falho hoje
```sql
select id, status, payment_status, payment_method, total_price, created_at
from public.orders
where payment_status = 'failed'
  and created_at > now() - interval '24 hours'
order by created_at desc;
```

### Ver se o cron de expiracao esta rodando
```sql
select jobname, schedule, active
from cron.job
where jobname = 'expire-pending-payment-orders';
```

### Ver ultimas execucoes do cron
```sql
select start_time, end_time, status, return_message
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'expire-pending-payment-orders')
order by start_time desc
limit 10;
```

### Ver pedidos presos em pending_payment ha mais de 40 minutos
```sql
select id, payment_method, total_price, created_at, now() - created_at as tempo_pendente
from public.orders
where status = 'pending_payment'
  and created_at < now() - interval '40 minutes'
order by created_at;
```

## Onde ver logs de Edge Functions

Supabase Dashboard → **Edge Functions** → selecionar a funcao → **Logs**

Filtros uteis:
- Status 500: erro interno (secret faltando, banco indisponivel)
- Status 502: MP API nao respondeu
- Status 401: webhook sem assinatura valida

## Apos deploy em producao

Rodar na ordem:
1. `select * from v_payment_health;`
2. Checar logs da funcao `webhook-mercado-pago` por 5 min
3. Fazer um pedido Pix de teste e validar que o status muda para `new` apos aprovacao

## Historico

* 2026-06-04: playbook criado com view v_payment_health.
