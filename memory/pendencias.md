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

* Pendencia: homologacao conjunta com equipe Teknisa.
* Prioridade: alta.
* Contexto: compras de balcao devem gerar pontos do Clube Cosechas pelo
  telefone informado no Teknisa.
* Status: **deployado e testado em 2026-06-08**. Todos os cenarios do checklist
  validados com sucesso em producao.
* Proximo passo: implementar claim automatico de eventos `pending` apos
  verificacao de telefone via Twilio; depois criar documento externo para
  Teknisa e agendar homologacao conjunta.

### Expiracao de creditos pendentes Teknisa

* Pendencia: monitorar cron em producao.
* Prioridade: media.
* Contexto: creditos pendentes nao devem ocupar banco indefinidamente.
* Status: **aplicado em 2026-06-08**. Cron `expire-teknisa-counter-sale-credits`
  agendado a cada hora via pg_cron. Limpeza fisica apos 90 dias de expirado.

### Handoff - proximos passos integracao Teknisa

* Estado em 2026-06-08:
  * Migration `20260608143000_create_counter_sale_point_events.sql` aplicada.
  * Migration `20260608150000_add_counter_purchase_reason_to_ledger.sql` aplicada
    (correcao: `counter_purchase` e `counter_purchase_cancelled` adicionados ao
    CHECK constraint de `loyalty_points_ledger.reason`).
  * Edge Function `teknisa-counter-sale` deployada (v1, ACTIVE).
  * Secret `TEKNISA_WEBHOOK_SECRET` configurado.
  * Todos os testes do checklist passaram (T8-T13).
* Proximos passos, em ordem:
  1. Implementar claim automatico de eventos `pending` apos verificacao de
     telefone via Twilio.
  2. Criar documento externo para Teknisa (`docs/teknisa-doc-externo.md`).
  3. Agendar homologacao conjunta com equipe Teknisa.
  4. Depois do claim Twilio, atualizar `docs/integracao-teknisa.md`,
     `docs/data-model.md` e este arquivo.
* Pontos de atencao:
  * A Edge Function exige header `X-Teknisa-Timestamp` e
    `X-Teknisa-Signature`.
  * Assinatura esperada: `sha256=<hex>` de
    `HMAC_SHA256(secret, timestamp + "." + raw_body)`.
  * Timestamp tem tolerancia maxima de 5 minutos.
  * O claim automatico pos-Twilio ainda nao foi implementado.
  * O documento externo deve conter: objetivo, URL real de producao,
    headers obrigatorios, algoritmo HMAC, exemplos curl, payloads finais,
    respostas esperadas, tabela de erros e checklist de homologacao.
