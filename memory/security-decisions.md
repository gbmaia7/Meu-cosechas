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

### 2026-06-03

* Decisao: pedido online pendente de pagamento nao deve aparecer na loja.
* Motivo: evitar preparo de pedido nao pago.
* Impacto: status `pending_payment`, `payment_failed` e `expired` ficam fora da
  operacao de loja/entregador.
* Arquivos afetados: `src/screens/Loja.tsx`, `docs/regras-negocio.md`.

## Pendencias

* Necessita validacao: politica de tentativas repetidas de PIN.
* Necessita validacao: matriz final de permissoes por rota.
* A definir: resposta a incidente.
