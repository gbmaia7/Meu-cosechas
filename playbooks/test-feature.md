# Playbook: Testar Funcionalidade

## Objetivo

Definir fluxo minimo para validar novas funcionalidades.

## Passos

1. Entender a regra de negocio afetada.
2. Identificar telas, Edge Functions e tabelas envolvidas.
3. Definir caso feliz.
4. Definir pelo menos um caso de erro.
5. Rodar `npm run lint`.
6. Rodar `npm run build` quando houver frontend.
7. Fazer validacao manual ou automatizada do fluxo.
8. Atualizar documentacao/memoria se houver nova regra.

## Criterios de aceite

* Fluxo principal funciona.
* Erros esperados exibem feedback.
* Nao ha regressao visivel em areas relacionadas.
* Verificacoes executadas foram registradas.
