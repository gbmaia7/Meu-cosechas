# Integracao Teknisa - Compras de Balcao

## Objetivo

Definir o contrato tecnico inicial para que o Teknisa envie compras de balcao
ao Meu-Cosechas e permita creditar pontos do Clube Cosechas pelo telefone do
cliente.

## Decisao

O Teknisa deve chamar uma Supabase Edge Function do Meu-Cosechas. O Teknisa nao
deve escrever diretamente no banco Supabase.

Motivos:

* centralizar regra de pontuacao no Meu-Cosechas;
* garantir idempotencia por venda;
* normalizar telefone;
* registrar auditoria;
* permitir expiracao de creditos pendentes;
* evitar exposicao de credenciais de banco.

## Fluxo

1. Cliente compra no balcao.
2. Atendente pergunta se o cliente deseja pontuar no Clube Cosechas.
3. Cliente informa telefone.
4. Teknisa registra telefone na venda.
5. Quando a venda for paga/finalizada, Teknisa envia evento ao Meu-Cosechas.
6. Meu-Cosechas normaliza o telefone e tenta localizar um usuario com telefone
   verificado.
7. Se existir usuario verificado, os pontos sao creditados imediatamente.
8. Se nao existir usuario verificado, os pontos ficam pendentes por telefone.
9. Quando o cliente criar conta e verificar telefone, os pontos pendentes ainda
   validos sao creditados automaticamente.

## Endpoint Proposto

Ambiente de producao:

```text
POST https://hfpqynfqtgpnvaopstun.supabase.co/functions/v1/teknisa-counter-sale
```

Ambiente de homologacao:

```text
A definir
```

## Autenticacao

Requisicoes devem ser autenticadas por assinatura HMAC.

Headers:

```text
X-Teknisa-Timestamp: 2026-06-08T18:30:00Z
X-Teknisa-Signature: sha256=<hex>
Content-Type: application/json
```

Assinatura:

```text
HMAC_SHA256(secret, timestamp + "." + raw_body)
```

Regras:

* o secret fica apenas no Teknisa e nos secrets da Edge Function;
* timestamp com tolerancia maxima de 5 minutos;
* requisicoes com assinatura invalida devem retornar `401`;
* requisicoes com timestamp muito antigo devem retornar `401`.

## Evento de Venda Paga

Payload:

```json
{
  "event": "counter_sale_paid",
  "external_sale_id": "TEKNISA-123456",
  "store_id": "dimension-barra",
  "phone": "+5521999999999",
  "amount": 32.9,
  "paid_at": "2026-06-08T18:30:00Z",
  "items": [
    {
      "sku": "FUNC-001",
      "name": "Funcional Exemplo",
      "quantity": 1,
      "unit_price": 32.9
    }
  ]
}
```

Campos obrigatorios:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `event` | string | Deve ser `counter_sale_paid` |
| `external_sale_id` | string | ID unico da venda no Teknisa |
| `store_id` | string | Unidade de origem |
| `phone` | string | Preferencialmente E.164 (`+55...`) |
| `amount` | number | Valor pago |
| `paid_at` | string | ISO 8601 |

Campos opcionais:

| Campo | Tipo | Regra |
| --- | --- | --- |
| `items` | array | Itens da venda para auditoria |

## Evento de Cancelamento

Payload:

```json
{
  "event": "counter_sale_cancelled",
  "external_sale_id": "TEKNISA-123456",
  "store_id": "dimension-barra",
  "cancelled_at": "2026-06-08T19:00:00Z",
  "reason": "cancelamento no caixa"
}
```

Regras:

* se os pontos ainda estiverem pendentes, marcar como `cancelled`;
* se os pontos ja tiverem sido creditados, criar lancamento negativo no ledger;
* o cancelamento tambem deve ser idempotente.

## Idempotencia

`external_sale_id` deve ser unico por venda.

Regras:

* reenvio da mesma venda nao pode gerar pontos duplicados;
* se o payload for identico, retornar sucesso com status existente;
* se o mesmo `external_sale_id` chegar com dados conflitantes, retornar `409`.

## Pontuacao

Regra MVP:

* cada venda paga de balcao gera 1 ponto;
* compras canceladas nao geram ponto;
* campanhas, multiplicadores e pontos por valor ficam fora do MVP.

## Creditos Pendentes

Quando o telefone ainda nao estiver vinculado a usuario verificado:

* criar credito pendente por telefone normalizado;
* status inicial: `pending`;
* validade sugerida: 45 dias;
* ao verificar telefone no app, creditar pontos pendentes ainda validos;
* apos expirar, marcar como `expired`;
* limpeza fisica do banco pode ocorrer apos 90 dias de expirado.

Status esperados:

```text
pending
claimed
expired
cancelled
```

## Modelo de Dados Proposto

Tabela sugerida: `counter_sale_point_events`

Campos principais:

| Campo | Regra |
| --- | --- |
| `id` | UUID |
| `source` | `teknisa` |
| `external_sale_id` | Unico |
| `store_id` | Unidade |
| `phone_e164` | Telefone normalizado |
| `user_id` | Preenchido quando houver usuario identificado |
| `amount` | Valor da venda |
| `points` | Pontos gerados |
| `status` | `pending`, `claimed`, `expired`, `cancelled` |
| `paid_at` | Data da venda |
| `expires_at` | Prazo para claim |
| `claimed_at` | Quando creditou |
| `cancelled_at` | Quando cancelou |
| `raw_payload` | Payload original para auditoria |
| `created_at` | Criacao |
| `updated_at` | Atualizacao |

## Respostas

Sucesso com credito imediato:

```json
{
  "ok": true,
  "status": "claimed",
  "points": 1
}
```

Sucesso com credito pendente:

```json
{
  "ok": true,
  "status": "pending",
  "points": 1,
  "expires_at": "2026-07-23T18:30:00Z"
}
```

Venda ja processada:

```json
{
  "ok": true,
  "status": "already_processed"
}
```

## Codigos de Erro

| Status HTTP | Motivo |
| --- | --- |
| 400 | Payload invalido |
| 401 | Assinatura invalida ou ausente |
| 409 | `external_sale_id` duplicado com dados conflitantes |
| 500 | Erro interno |

## Checklist de Homologacao

* venda paga com telefone de usuario ja verificado credita ponto imediato;
* venda paga com telefone sem conta cria credito pendente;
* cliente verifica telefone e recebe credito pendente;
* venda reenviada nao duplica pontos;
* venda cancelada antes do claim marca credito como cancelado;
* venda cancelada depois do claim cria ajuste negativo;
* credito pendente expira apos o prazo definido;
* assinatura invalida retorna `401`.

## Pendencias

* Definir URL de homologacao.
* Definir secret HMAC com Teknisa.
* Confirmar formato de telefone que o Teknisa consegue enviar.
* Confirmar se o Teknisa envia cancelamento/estorno.
* Implementar Edge Function.
* Criar migrations das tabelas.
* Integrar claim automatico apos verificacao Twilio.
* Criar rotina de expiracao e limpeza de creditos pendentes.

## Historico de Atualizacao

* 2026-06-08: contrato tecnico inicial definido.
