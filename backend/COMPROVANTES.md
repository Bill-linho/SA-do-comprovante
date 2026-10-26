# Comprovantes e pagamento simulado

Esta implementação é para desenvolvimento/trabalho acadêmico. **Não recebe nem movimenta dinheiro real.** Não é integração bancária, não é comprovante fiscal e não substitui nota fiscal.

## O que foi reaproveitado

- `Pedido` continua sendo a fonte de verdade do valor total, cliente, mesa e status.
- `ItemPedido` e `Prato` fornecem os itens e nomes para o PDF.
- `Usuario` continua guardando os dados existentes do cliente.
- `HistoricoPedido` registra a simulação de pagamento.
- Não foi criada uma tabela `Comprovante` nem uma tabela `Pagamento`: o PDF é montado sob demanda e os campos de simulação ficam no pedido para evitar duplicação neste projeto simples.

## Atualizar banco existente

Faça backup primeiro. Execute o arquivo `src/migrations/001_pagamento_fake.sql` uma única vez no banco PostgreSQL usado pela aplicação. Exemplo via `psql`:

```bash
psql -h localhost -U SEU_USUARIO -d SEU_BANCO -f src/migrations/001_pagamento_fake.sql
```

Se o banco ainda não tem a tabela `pedidos`, inicie a aplicação para o Sequelize criar as tabelas e depois execute a migração. A migração não é executada automaticamente.

## Endpoints

### Simular pagamento aprovado

`POST /pedidos/:id/pagamento-teste`

Cabeçalho: `Authorization: Bearer SEU_TOKEN` e `Content-Type: application/json`.

```json
{
  "metodo": "pix",
  "resultado": "aprovado"
}
```

Métodos: `dinheiro`, `pix`, `cartao_credito`, `cartao_debito`. O resultado é opcional e aceita `aprovado` ou `recusado` (padrão: `aprovado`). Somente usuários com a permissão `pagamento.simular` podem usar o endpoint (atendente, gerente e admin, conforme o seeder). O endpoint recusa pedido cancelado e não permite aprovar novamente um pedido já pago.

### PDF do cliente

`GET /pedidos/:id/comprovante?tipo=cliente`

Cliente pode consultar apenas o próprio pedido. Equipe pode consultar para atendimento. O PDF abre no navegador; use Ctrl+P para imprimir.

### Via da cozinha

`GET /pedidos/:id/comprovante?tipo=cozinha`

Permitido à cozinha, atendente, gerente e admin. A via mostra mesa e itens, mas não dados de pagamento. Também pode ser impressa pelo navegador.

## Teste manual

1. Inicie a API e autentique como atendente/gerente/admin.
2. Use um `id` de pedido que já exista e envie o POST de pagamento de teste.
3. Abra `GET /pedidos/ID/comprovante?tipo=cliente` e `GET /pedidos/ID/comprovante?tipo=cozinha` com o mesmo token.
4. O frontend pode abrir a URL autenticada em nova aba ou buscar o PDF como blob com Axios e abrir o blob. Depois o usuário imprime pela interface do navegador.

## Limitações intencionais

- A simulação não confirma um pagamento real; nunca use essa rota em produção.
- O PDF é informativo, marcado como não fiscal e não substitui NFC-e/NF-e.
- A impressão ocorre no navegador do usuário. Impressão silenciosa/direta exige uma aplicação local ou serviço de impressão confiável.
