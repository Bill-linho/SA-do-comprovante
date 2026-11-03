# Casa & Sabor — Frontend

Frontend React + Vite integrado ao backend Express + Sequelize.

## Executar
1. Entre na pasta `restaurante-frontend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env`.
4. Confira `VITE_API_URL=http://localhost:3000`.
5. Execute `npm run dev` e abra `http://localhost:5173`.

## Rotas utilizadas
- `POST /auth/cadastro`
- `POST /auth/login`
- `GET /pratos`
- `POST /pedidos`
- `POST /pedidos/:id/pagamento-teste`
- `GET /pedidos/:id/comprovante?tipo=cliente`

O JWT fica no `localStorage` e é enviado no cabeçalho `Authorization: Bearer TOKEN`.

## Pagamento
O pagamento é apenas simulado para desenvolvimento acadêmico. Não há integração com banco, adquirente ou movimentação de dinheiro real.

## Observações
- O backend calcula os valores usando os preços atuais do banco; o navegador não envia preços.
- O usuário precisa estar autenticado para finalizar um pedido.
- O cadastro cria automaticamente o papel `cliente`.
- A conta precisa ter o papel/permissão adequado para acessar rotas administrativas.
- Atualize endereço, telefone, horário e redes sociais fictícios no `src/App.jsx`.
