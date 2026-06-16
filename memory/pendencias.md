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
* Status: **obsoleto/parcialmente concluido em 2026-06-16**. Cartao online foi
  removido; `VITE_MERCADO_PAGO_PUBLIC_KEY` nao e mais requisito do frontend.
  Pendencia remanescente: validar webhook Mercado Pago e credenciais de
  producao para Pix Orders API.

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
  verificacao de telefone via Vonage (substituiu Twilio); depois criar documento externo para
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
     telefone via Vonage (provider SMS escolhido em 2026-06-09, substituindo Twilio).
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
  * O claim automatico pos-verificacao de telefone (Vonage) ainda nao foi implementado.
  * O documento externo deve conter: objetivo, URL real de producao,
    headers obrigatorios, algoritmo HMAC, exemplos curl, payloads finais,
    respostas esperadas, tabela de erros e checklist de homologacao.

### Go-live Pix Orders API

* Pendencia: executar teste end-to-end de producao controlado apos deploy final
  do frontend.
* Prioridade: alta.
* Contexto: `create-mercado-pago-payment` e `get-mercado-pago-payment` foram
  deployadas em 2026-06-16; o frontend foi enviado para `main` no commit
  `4a20ad7`.
* Checklist minimo:
  1. Criar pedido Pix real de baixo valor.
  2. Confirmar QR Code e copia-e-cola em `/pagamento/pix`.
  3. Pagar ou simular confirmacao e validar webhook/polling.
  4. Confirmar que loja ve o pedido apenas apos `payment_status = paid`.
  5. Confirmar que `pagamento-confirmado`, loja e acompanhamento mostram o
     mesmo `pickup_code`.
* Status: aberto.

### Documentos legados de cartao online

* Pendencia: atualizar docs/playbooks que ainda citam Secure Fields, cartao
  online, `VITE_MERCADO_PAGO_PUBLIC_KEY` como obrigatoria e funcoes `save-card`.
* Prioridade: media.
* Contexto: `docs/pagamentos-mercado-pago.md` foi atualizado, mas auditoria de
  2026-06-16 encontrou referencias antigas em `docs/security.md`,
  `docs/deployment.md`, `docs/testing.md`, `docs/environments.md` e
  `playbooks/release-checklist.md`.
* Status: aberto.

### Route guards de operacao

* Pendencia: adicionar/validar protecao frontend para `/loja` e `/entregador`.
* Prioridade: alta.
* Contexto: RLS/RPC protegem dados sensiveis no backend, mas as rotas continuam
  registradas diretamente no frontend. A propria documentacao marca route
  guards como pendencia.
* Status: **concluido em 2026-06-16**. Criado `ProtectedRoleRoute`; `/loja`
  aceita `store`/`admin`, `/entregador` aceita `delivery`/`store`/`admin`.
  Usuarios sem sessao ainda veem o login interno das telas; usuarios logados
  com role errada sao bloqueados antes da tela operacional. RLS/RPC seguem como
  camada de seguranca real.

### Observabilidade de pagamentos

* Pendencia: definir rotina operacional para checar falhas de Edge Functions,
  webhooks nao processados e pagamentos pendentes/expirados.
* Prioridade: alta.
* Contexto: Pix depende de Orders API + webhook/polling. Sem painel/rotina,
  falhas podem virar pedidos parados em `pending_payment`.
* Status: aberto.

### Dependencias com vulnerabilidades conhecidas

* Pendencia: revisar e aplicar atualizacoes de dependencias apos teste de
  regressao.
* Prioridade: alta.
* Contexto: `npm audit --omit=dev` em 2026-06-16 retornou 10 vulnerabilidades
  (7 high), incluindo `vite`/`esbuild`, `react-router`, `protobufjs`, `ws`,
  `express`/`qs` e `@babel/core`. `npm audit fix` existe, mas pode alterar
  dependencias centrais e deve ser validado separadamente.
* Status: **concluido em 2026-06-16**. Executado `npm audit fix` e, para
  remover as vulnerabilidades restantes de `vite`/`esbuild`, `npm audit fix
  --force`. O projeto passou em `npm run lint`, `npm run build` e `npm audit
  --omit=dev` retornou 0 vulnerabilidades. Atencao operacional: `vite@8.0.16`
  exige Node `^20.19.0 || >=22.12.0`; validar que o ambiente de deploy usa uma
  versao compativel.

### Scripts demo com credenciais fixas

* Pendencia: garantir que scripts demo/criacao de usuario de loja nao sejam
  executados em producao com senha padrao.
* Prioridade: media.
* Contexto: auditoria encontrou `loja123456` em scripts SQL de seed/criacao de
  usuario. Isso e aceitavel para demo/local, mas perigoso em producao.
* Status: aberto.

### Expiracao de pedidos presenciais de balcao

* Pendencia: cancelar automaticamente pedidos de balcao com pagamento no caixa
  nao confirmado.
* Prioridade: alta.
* Contexto: pedidos presenciais de balcao aparecem no painel da loja como
  `new` + `payment_status = pay_on_delivery`; sem expiracao, pedidos nao pagos
  podem permanecer visiveis e serem preparados por engano.
* Status: **concluido em 2026-06-16**. Definido prazo de 5 minutos; migration
  `20260616120000_expire_counter_pay_on_delivery_orders.sql` agenda o cron
  `expire-counter-pay-on-delivery-orders` a cada minuto para marcar esses
  pedidos como `cancelled` + `payment_status = failed`, com `cancelled_at` e
  motivo operacional. Migration aplicada no Supabase remoto em 2026-06-16 apos
  reconciliacao do historico de migrations.

### Drift de migrations Supabase

* Pendencia: reconciliar historico remoto/local de migrations para permitir
  `supabase db push` seguro.
* Prioridade: alta.
* Contexto: o remoto tinha migrations registradas que nao existiam localmente, e
  o local tinha migrations antigas ja refletidas no banco, mas sem registro
  remoto pelo mesmo timestamp. Isso bloqueava `supabase db push`.
* Status: **concluido em 2026-06-16**. Criados placeholders locais para as
  migrations ja registradas no remoto; executado `supabase migration repair
  --status applied` apenas para migrations locais antigas ja consideradas
  aplicadas; `supabase db push --linked --dry-run` passou a mostrar somente a
  migration nova de expiracao presencial e, apos o push, retornou `Remote
  database is up to date`.
