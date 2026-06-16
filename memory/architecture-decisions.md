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

### 2026-06-09

* Decisao: substituir Twilio por Vonage como provider SMS para OTP de verificacao de telefone.
* Motivo: decisao operacional do usuario; Vonage oferece melhor custo-beneficio para operacao brasileira de pequeno/medio volume e tem suporte nativo no Supabase Auth.
* Impacto: configurar Vonage como phone provider no Supabase Dashboard (sem alteracao de codigo — frontend continua usando `supabase.auth.signInWithOtp`).
* Arquivos afetados: configuracao no Supabase Dashboard (Authentication > Phone Provider).

### 2026-06-16

* Decisao: remover cartao online do fluxo digital e manter Pix automatico via
  Mercado Pago Orders API.
* Motivo: reduzir custo tecnico recorrente de Secure Fields, 3DS, antifraude e
  cartoes salvos; cartao passa a ser resolvido operacionalmente na maquininha.
* Impacto: `Pagamento.tsx` oferece Pix ou pagamento presencial; cartao/dinheiro
  usam `payment_method = 'cash'` e `payment_status = 'pay_on_delivery'`;
  `PagamentoPresencial.tsx` virou a tela dedicada para pagamento no caixa ou na
  entrega; rotas/telas/funcoes de cartao salvo foram removidas.
* Arquivos afetados: `src/screens/Pagamento.tsx`,
  `src/screens/PagamentoPresencial.tsx`, `src/routes/index.tsx`,
  `supabase/functions/create-mercado-pago-payment/index.ts`.

### 2026-06-16

* Decisao: Pix na Orders API deve usar fetch raw e extrair QR diretamente de
  `transactions.payments[0].payment_method` quando presente.
* Motivo: a resposta real do Mercado Pago pode retornar `qr_code`,
  `qr_code_base64` e `ticket_url` diretamente em `payment_method`, nao apenas em
  `transaction_data`.
* Impacto: `create-mercado-pago-payment` salva QR no momento da criacao;
  `get-mercado-pago-payment` tambem recupera/salva QR para pedidos ja criados.
* Arquivos afetados: `supabase/functions/create-mercado-pago-payment/index.ts`,
  `supabase/functions/get-mercado-pago-payment/index.ts`,
  `src/screens/PagamentoPix.tsx`.

## Pendencias

* A definir: padrao oficial de migrations. (resolvido em 2026-06-04 — ver docs/database.md)
* Remover as 3 Edge Functions InfinitePay do Supabase Dashboard se ainda estiverem ativas.
