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

* Pendencia: aplicar e homologar contrato tecnico definido em `docs/integracao-teknisa.md`.
* Prioridade: alta.
* Contexto: compras de balcao devem gerar pontos do Clube Cosechas pelo
  telefone informado no Teknisa.
* Proximo passo: aplicar migration `20260608143000_create_counter_sale_point_events.sql`,
  configurar `TEKNISA_WEBHOOK_SECRET` e deployar Edge Function
  `teknisa-counter-sale`.
* Status: implementado localmente; deploy/homologacao pendentes.

### Expiracao de creditos pendentes Teknisa

* Pendencia: aplicar e validar expiracao/limpeza de creditos pendentes por
  telefone.
* Prioridade: alta.
* Contexto: creditos pendentes nao devem ocupar banco indefinidamente.
* Proximo passo: validar cron criado na migration
  `20260608143000_create_counter_sale_point_events.sql`.
* Status: implementado localmente; aplicacao em producao pendente.

### Handoff - proximos passos integracao Teknisa

* Contexto: a documentacao da integracao Teknisa foi commitada em
  `b21f89b document teknisa counter sales integration`.
* Contexto: a implementacao local inicial foi criada, mas ainda nao foi
  commitada nem deployada.
* Arquivos locais implementados:
  * `supabase/migrations/20260608143000_create_counter_sale_point_events.sql`
  * `supabase/functions/teknisa-counter-sale/index.ts`
  * `docs/deployment.md`
  * `docs/data-model.md`
  * `memory/pendencias.md`
* Estado esperado do git antes de continuar:
  * branch `main` esta `ahead 2` de `origin/main` por commits locais ja feitos;
  * existe alteracao nao relacionada em `.claude/settings.local.json`;
  * existem alteracoes locais da implementacao Teknisa ainda nao commitadas.
* Validacoes ja executadas apos a implementacao local:
  * `npm run lint` passou;
  * `npm run build` passou.
* Proximos passos recomendados, em ordem:
  1. Revisar diff local da integracao Teknisa e manter `.claude/settings.local.json`
     fora do commit.
  2. Commitar a implementacao local da integracao Teknisa.
  3. Fazer push dos commits locais para `origin/main`, se a decisao for publicar.
  4. Configurar secret `TEKNISA_WEBHOOK_SECRET` no Supabase Edge Functions.
  5. Aplicar migration `20260608143000_create_counter_sale_point_events.sql`
     no projeto Supabase.
  6. Deployar Edge Function `teknisa-counter-sale`.
  7. Testar assinatura HMAC localmente ou em homologacao.
  8. Testar venda paga com telefone ja verificado: deve criar evento `claimed`,
     creditar 1 ponto, criar ledger `counter_purchase` e incrementar
     `profiles.total_orders`.
  9. Testar venda paga com telefone sem conta/verificacao: deve criar evento
     `pending` com `expires_at` em 45 dias e nao creditar pontos ainda.
  10. Testar reenvio identico da venda: deve retornar `already_processed` e nao
      duplicar pontos.
  11. Testar reenvio com mesmo `external_sale_id` e payload conflitante: deve
      retornar `409`.
  12. Testar cancelamento de venda `pending`: deve mudar status para
      `cancelled` sem mexer em pontos.
  13. Testar cancelamento de venda `claimed`: deve mudar status para
      `cancelled`, criar ledger `counter_purchase_cancelled`, remover 1 ponto
      e reduzir `total_orders` em 1.
  14. Implementar a proxima etapa: claim automatico de eventos `pending` apos
      verificacao de telefone via Twilio.
  15. Criar documento externo final para Teknisa antes da homologacao conjunta.
      Arquivo sugerido: `docs/teknisa-doc-externo.md`.
  16. Depois do claim Twilio, atualizar `docs/integracao-teknisa.md`,
      `docs/data-model.md` e este arquivo.
* Pontos de atencao:
  * A Edge Function exige header `X-Teknisa-Timestamp` e
    `X-Teknisa-Signature`.
  * Assinatura esperada: `sha256=<hex>` de
    `HMAC_SHA256(secret, timestamp + "." + raw_body)`.
  * Timestamp tem tolerancia maxima de 5 minutos.
  * O Teknisa nao deve escrever diretamente no Supabase.
  * O claim automatico pos-Twilio ainda nao foi implementado.
  * O documento atual `docs/integracao-teknisa.md` e contrato interno/inicial.
    Ainda falta gerar um documento externo, direto para a equipe Teknisa, depois
    que a base tecnica estiver aplicada/testada e antes da homologacao conjunta.
  * O documento externo deve conter: objetivo, URL real de producao/homologacao,
    headers obrigatorios, algoritmo HMAC, exemplos `curl`, payloads finais,
    respostas esperadas, tabela de erros, checklist de homologacao e o que
    esperamos do time Teknisa.
