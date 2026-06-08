# Pendencias

Registrar pendencias operacionais, tecnicas e de produto.

## Registro

### RLS orders_store_select — pending_payment

* Pendencia: filtrar pedidos pending_payment no RLS, nao apenas no frontend.
* Prioridade: alta.
* Status: **concluido** em 2026-06-04.
* Resolucao: migration `fix_rls_store_pending_payment` aplicada — policies `orders_store_select` e `orders_store_update` agora incluem `status != pending_payment`.


### Documentacao de pagamentos

* Pendencia: validar credenciais e webhook Mercado Pago em ambiente de teste.
* Prioridade: alta.
* Contexto: gateway oficial definido como Mercado Pago Checkout Transparente; InfinitePay nao sera usado.
* Responsavel: A definir.
* Proximo passo: configurar `VITE_MERCADO_PAGO_PUBLIC_KEY`, `MERCADO_PAGO_ACCESS_TOKEN` e webhook no painel Mercado Pago.
* Status: aberto.

### Validacao de assinatura do webhook — MERCADO_PAGO_WEBHOOK_SECRET

* Pendencia: garantir que o secret esteja configurado como secret da Edge Function no Supabase antes do go-live.
* Prioridade: alta.
* Contexto: a Edge Function webhook-mercado-pago agora exige o secret obrigatoriamente; sem ele retorna 500.
* Proximo passo: configurar MERCADO_PAGO_WEBHOOK_SECRET no painel Supabase > Edge Functions > Secrets.
* Status: correcao deployada em 2026-06-04; configuracao do secret em producao pendente de validacao.

### Migrations Supabase

* Pendencia: definir padrao oficial para versionar e aplicar migrations.
* Prioridade: alta.
* Contexto: pasta `supabase/` possui SQLs operacionais e scripts demo.
* Responsavel: A definir.
* Proximo passo: separar migrations, seeds e scripts de demo.
* Status: aberto.

### Testes automatizados

* Pendencia: definir suite minima de testes.
* Prioridade: media.
* Contexto: scripts atuais incluem `lint` e `build`, mas nao ha script de teste observado.
* Responsavel: A definir.
* Proximo passo: decidir ferramenta e cobertura inicial.
* Status: aberto.

### Integracao Teknisa - compras de balcao

* Pendencia: implementar contrato tecnico definido em `docs/integracao-teknisa.md`.
* Prioridade: alta.
* Contexto: compras de balcao devem gerar pontos do Clube Cosechas pelo
  telefone informado no Teknisa.
* Proximo passo: criar migration da tabela de eventos e Edge Function
  `teknisa-counter-sale`.
* Status: aberto.

### Expiracao de creditos pendentes Teknisa

* Pendencia: definir e implementar expiracao/limpeza de creditos pendentes por
  telefone.
* Prioridade: alta.
* Contexto: creditos pendentes nao devem ocupar banco indefinidamente.
* Proximo passo: usar prazo inicial sugerido de 45 dias para claim e limpeza
  fisica apos 90 dias de expirado, salvo decisao contraria.
* Status: aberto.
