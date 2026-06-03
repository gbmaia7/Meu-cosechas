# Playbook: Debug de Producao

## Objetivo

Padronizar investigacao de bugs sem introduzir mudancas amplas ou arriscadas.

## Quando usar

Use para incidentes, bugs reportados por usuarios, divergencias em pedidos,
pagamento, loja, entregador ou Clube Cosechas.

## Passos

1. Registrar sintoma, horario, usuario/pedido afetado quando disponivel.
2. Reproduzir em ambiente seguro quando possivel.
3. Ler somente arquivos relacionados ao sintoma.
4. Consultar:
   * `memory/bugs-recorrentes.md`
   * docs do fluxo afetado
   * decisoes em `memory/`
5. Separar causa provavel de evidencia confirmada.
6. Fazer fix minimo.
7. Rodar verificacoes relevantes.
8. Atualizar `memory/bugs-recorrentes.md` se o bug puder voltar.
9. Reportar impacto e risco residual.

## Checklist

* [ ] Sintoma documentado.
* [ ] Escopo limitado.
* [ ] Causa confirmada ou incerteza explicitada.
* [ ] Fix validado.
* [ ] Memoria atualizada se aplicavel.

## Pendencias

* A definir: padrao de logs e observabilidade.
* Necessita validacao: acesso oficial a logs de producao.
