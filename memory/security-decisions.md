# Decisoes de Seguranca

Registrar decisoes de seguranca relevantes para reduzir regressao.

## Registro

### 2026-06-03

* Decisao: Access Token Mercado Pago deve ficar somente no backend.
* Motivo: evitar criacao/consulta indevida de pagamentos por usuarios finais.
* Impacto: frontend usa apenas `VITE_MERCADO_PAGO_PUBLIC_KEY`; Edge Functions
  usam `MERCADO_PAGO_ACCESS_TOKEN`.
* Arquivos afetados: `.env.example`, `src/screens/Pagamento.tsx`,
  `supabase/functions/create-mercado-pago-payment/index.ts`.
* Atualizacao 2026-06-16: como cartao online foi removido, o frontend nao
  precisa mais de `VITE_MERCADO_PAGO_PUBLIC_KEY`; a regra critica permanece:
  `MERCADO_PAGO_ACCESS_TOKEN`, `MERCADO_PAGO_WEBHOOK_SECRET` e
  `SUPABASE_SERVICE_ROLE_KEY` ficam somente nas Edge Functions.

### 2026-06-03

* Decisao: pedido online pendente de pagamento nao deve aparecer na loja.
* Motivo: evitar preparo de pedido nao pago.
* Impacto: status `pending_payment`, `payment_failed` e `expired` ficam fora da
  operacao de loja/entregador.
* Arquivos afetados: `src/screens/Loja.tsx`, `docs/regras-negocio.md`.

### 2026-06-16

* Decisao: pagamentos presenciais nao passam por Mercado Pago; sao confirmados
  operacionalmente pela loja/entregador.
* Motivo: reduzir superficie de risco de cartao online e manter confirmacao
  manual onde a cobranca acontece fisicamente.
* Impacto: balcao com `payment_status = 'pay_on_delivery'` so entra em preparo
  apos a loja clicar "Pago"; delivery pago na entrega continua com PIN de
  seguranca para confirmar recebimento.

## Pendencias

* Necessita validacao: politica de tentativas repetidas de PIN.
* Necessita validacao: matriz final de permissoes por rota.
* Necessita validacao: route guards frontend para `/loja` e `/entregador`
  alinhados com RLS/RPC de backend.
* A definir: resposta a incidente.
