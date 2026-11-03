# Casa & Sabor — Frontend

Frontend demonstrativo em React + Vite para o backend Express/Sequelize enviado.

## Executar
1. Entre na pasta `restaurante-frontend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e confira `VITE_API_URL`.
4. Execute `npm run dev`.

## O que já conversa com o backend
- `POST /auth/login`
- `POST /auth/cadastro`
- `POST /pedidos/:id/pagamento-teste`
- `GET /pedidos/:id/comprovante?tipo=cliente` (PDF autenticado)

O token JWT é salvo no `localStorage` e enviado como `Authorization: Bearer ...`.

## Rotas que faltam no backend para o fluxo completo
O ZIP do backend não contém:
- `GET /pratos` para listar o cardápio;
- `POST /pedidos` para criar um pedido e seus itens, calcular o total no servidor e retornar o ID.

O frontend tenta consultar `GET /pratos`; se não encontrar, mostra um cardápio demonstrativo local. O checkout está preparado para chamar `POST /pedidos`, mas não será concluído até essa rota existir. O pagamento simulado só deve ser chamado depois que o pedido real for criado.

## Contrato sugerido para POST /pedidos
Cabeçalho: `Authorization: Bearer TOKEN`

```json
{
  "itens": [
    { "prato_id": 1, "quantidade": 2 },
    { "prato_id": 4, "quantidade": 1 }
  ],
  "metodo_pagamento": "pix"
}
```

Resposta sugerida:
```json
{
  "mensagem": "Pedido criado",
  "pedido": { "id": 123, "valor_total": "75.80", "status": "aberto" }
}
```

O servidor deve buscar os preços atuais dos pratos no banco e calcular `valor_total`; não confie em valores enviados pelo navegador. A rota de criação também precisa validar disponibilidade e associar o pedido ao usuário autenticado. O pagamento é simulado e não movimenta dinheiro real.

## Observações
- Os pratos de demonstração usam emojis e preços fictícios; substitua pelos dados reais do banco.
- Ajuste o CORS do backend para permitir a origem do Vite (`http://localhost:5173`).
- Não publique credenciais do `.env` do backend.
