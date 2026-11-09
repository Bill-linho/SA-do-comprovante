# Backend — Casa & Sabor

## Instalação
1. Entre na pasta `backend`.
2. Execute `npm install`.
3. Copie `.env.example` para `.env` e preencha os dados do PostgreSQL e `JWT_SECRET`.
4. Execute `npm start`.

O servidor usa `PORT` (padrão 3000) e permite o frontend definido em `FRONTEND_URL` (padrão `http://localhost:5173`).

## Rotas principais

### Autenticação
- `POST /auth/cadastro` — cria usuário e atribui o papel `cliente`.
- `POST /auth/login` — retorna JWT com validade de 1 hora e `expiraEm`.

### Cardápio
- `GET /pratos` — lista pratos disponíveis.
- `GET /pratos/:id` — consulta um prato.
- `POST /pratos` — gerente/admin com `produto.gerenciar`.
- `PUT /pratos/:id` — gerente/admin com `produto.gerenciar`.
- `DELETE /pratos/:id` — desativa o prato (não apaga o histórico).

### Pedidos
- `POST /pedidos` — cliente/atendente cria pedido.
- `GET /pedidos/meus` — lista pedidos do cliente autenticado.
- `GET /pedidos/:id` — detalhe do pedido (dono ou equipe).
- `GET /pedidos` — lista geral para equipe autorizada.
- `GET /pedidos/cozinha` — fila da cozinha.
- `PATCH /pedidos/:id/status` — atualiza status conforme permissão.
- `PATCH /pedidos/:id/cancelar` — cliente cancela enquanto o pedido está aberto e não pago.

### Pagamento e comprovantes
- `POST /pedidos/:id/pagamento-teste` — simulação de pagamento; não movimenta dinheiro real.
- `GET /pedidos/:id/comprovante?tipo=cliente` — PDF do cliente.
- `GET /pedidos/:id/comprovante?tipo=cozinha` — PDF da cozinha, restrito à equipe.
- `GET /pedidos/:id/historico` — histórico para equipe autorizada.

### Gerência
- `GET /gerencia/usuarios` — lista usuários sem expor hashes de senha.
- `PATCH /gerencia/usuarios/:id/papel` — altera papel de outro usuário.

## Permissões
O RBAC é inicializado no start. Novos cadastros recebem `cliente`. Para promover um usuário, use a rota de gerência com um gerente/admin autenticado:
```json
{ "papel": "cozinheiro" }
```
Papéis aceitos: `cliente`, `atendente`, `cozinheiro`, `gerente`, `admin`.

## Migrações para bancos já existentes
`sequelize.sync()` cria tabelas ausentes, mas não altera tabelas existentes. Execute uma vez no PostgreSQL:
- `src/migrations/001_pagamento_fake.sql`
- `src/migrations/002_categoria_pratos.sql`

Não use `sync({ alter: true })` em produção sem revisar as alterações propostas.
