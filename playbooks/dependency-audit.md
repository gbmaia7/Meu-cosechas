# Playbook: Auditoria de Dependencias

## Objetivo

Orientar verificacao de dependencias antes de upgrades ou adicoes.

## Passos

1. Verificar `package.json` e `package-lock.json`.
2. Confirmar se a dependencia e realmente necessaria.
3. Preferir SDK oficial quando a integracao envolver pagamentos ou seguranca.
4. Rodar comandos disponiveis de verificacao.
5. Validar impacto de bundle quando aplicavel.
6. Documentar riscos e decisoes.

## Comandos

* `npm run lint`
* `npm run build`
* A definir: comando oficial de auditoria de vulnerabilidades.

## Pendencias

* Necessita validacao: politica de atualizacao de dependencias.
* A definir: tolerancia para vulnerabilidades por severidade.
