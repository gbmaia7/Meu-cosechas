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

## Pendencias

* A definir: padrao oficial de migrations.
* Necessita validacao: separar documentacao de pagamentos InfinitePay e Mercado Pago.
