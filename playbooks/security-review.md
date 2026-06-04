# Playbook: Revisao de Seguranca

## Objetivo

Padronizar revisao de seguranca antes de entregar mudancas sensiveis.

## Quando usar

* Pagamentos.
* Autenticacao/autorizacao.
* Dados pessoais.
* Edge Functions.
* Mudancas em policies RLS.

## Passos

1. Identificar dados, roles e secrets envolvidos.
2. Consultar `docs/security.md`, `docs/threat-model.md` e
   `docs/auth-permissions.md`.
3. Verificar se secrets nao aparecem no frontend.
4. Verificar se inputs externos sao validados no backend.
5. Verificar se RLS cobre novas tabelas.
6. Verificar logs para evitar dados sensiveis.
7. Registrar decisoes em `memory/security-decisions.md`.

## Checklist

* Secrets protegidos.
* Permissoes coerentes.
* Webhooks idempotentes.
* Dados sensiveis minimizados.
* Regressao de seguranca avaliada.
