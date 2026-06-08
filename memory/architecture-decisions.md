# Decisoes de Arquitetura

Registrar decisoes tecnicas relevantes para evitar redescoberta e inconsistencias.

## Registro

### 2026-06-03

* Decisao: usar `AGENTS.md` como ponto de entrada e distribuir detalhes em `docs/`, `memory/` e `playbooks/`.
* Motivo: reduzir consumo de contexto e orientar agentes a lerem somente o necessario.
* Impacto: agentes devem consultar documentos especificos por tarefa.
* Arquivos afetados: `AGENTS.md`, `docs/*`, `memory/*`, `playbooks/*`.

### 2026-06-03

* Decisao: validacao de PIN de entrega deve ocorrer no backend via Supabase RPC.
* Motivo: evitar conclusao de entrega apenas por validacao no frontend.
* Impacto: entregador envia PIN para RPC; PIN em texto claro nao deve ser exposto para loja/entregador.
* Arquivos afetados: `supabase/confirm_delivery_pin.sql`, `src/screens/Entregador.tsx`, `src/screens/Loja.tsx`, `src/context/CartContext.tsx`.

### 2026-06-03

* Decisao: substituir InfinitePay por Mercado Pago Checkout Transparente.
* Motivo: InfinitePay direciona para checkout externo; o produto deve manter Pix e cartao dentro do app.
* Impacto: pedidos online passam a nascer como `pending_payment`; Mercado Pago confirma via webhook/consulta backend; loja so deve ver pedido pago.
* Arquivos afetados: `src/screens/Pagamento.tsx`, `src/screens/PagamentoPix.tsx`, `src/screens/ValidandoPagamento.tsx`, `supabase/functions/create-mercado-pago-payment/index.ts`, `supabase/functions/get-mercado-pago-payment/index.ts`, `supabase/functions/webhook-mercado-pago/index.ts`, `supabase/mercado_pago_payments.sql`.

### 2026-06-04

* Decisao: remover Edge Functions legadas InfinitePay.
* Motivo: Mercado Pago validado em sandbox; InfinitePay nao sera mais usado.
* Impacto: arquivos locais excluidos. Funcoes remotas devem ser deletadas no Supabase Dashboard.
* Arquivos afetados: `supabase/functions/create-infinite-checkout`, `verify-infinite-payment`, `webhook-infinitepay`.

### 2026-06-08

* Decisao: integrar compras de balcao do Teknisa via Supabase Edge Function do
  Meu-Cosechas, nao por escrita direta no banco.
* Motivo: manter idempotencia, seguranca, normalizacao de telefone, auditoria e
  regra de pontuacao dentro do Meu-Cosechas.
* Impacto: Teknisa devera enviar eventos assinados de venda paga/cancelada; o
  Meu-Cosechas decide se credita imediatamente ou cria credito pendente.
* Arquivos afetados: `docs/integracao-teknisa.md`, `docs/regras-negocio.md`,
  `docs/data-model.md`.

## Pendencias

* A definir: padrao oficial de migrations. (resolvido em 2026-06-04 — ver docs/database.md)
* Remover as 3 Edge Functions InfinitePay do Supabase Dashboard se ainda estiverem ativas.
