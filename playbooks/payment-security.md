# Playbook: Seguranca de Pagamentos

## Objetivo

Padronizar revisao de seguranca para Pix, cartao e webhooks.

## Passos

1. Consultar `docs/pagamentos-mercado-pago.md` e `docs/security.md`.
2. Confirmar que o fluxo nao usa checkout externo.
3. Confirmar que cartao e tokenizado por MercadoPago.js.
4. Confirmar que Access Token fica apenas no backend.
5. Confirmar idempotencia de webhook.
6. Confirmar que pedido pendente nao aparece na loja.
7. Testar pagamento aprovado, pendente e recusado.
8. Registrar decisoes ou bugs recorrentes.

## Checklist

* Public Key no frontend.
* Access Token em secret backend.
* Nenhum dado cru de cartao no backend.
* Webhook validado quando segredo estiver configurado.
* Status operacional nao regride por webhook duplicado.
