# Arquitetura do frontend

O frontend foi reorganizado em React + Vite com React Router.

```text
src/
├── components/       # Componentes visuais reutilizáveis
├── contexts/         # Estado global (sessão/autenticação)
├── hooks/            # Estado e lógica reutilizável
├── pages/            # Páginas associadas às rotas
├── services/         # Comunicação HTTP com a API
├── App.jsx           # Rotas e composição geral
├── main.jsx          # Inicialização dos providers
└── styles.css
```

## Fluxo de autenticação

`AuthProvider` mantém o usuário autenticado e disponibiliza `login`, `register` e `logout` pelo hook `useAuth`. O token JWT é salvo em `localStorage`; `apiClient.js` o envia no cabeçalho `Authorization: Bearer`.

## Serviços

- `authService`: cadastro e login.
- `productService`: produtos e categorias.
- `tableService`: mesas ativas.
- `orderService`: pedidos, status, pagamento e comprovantes.
- `reservationService`: reservas.

## RBAC no frontend

A interface esconde ações de acordo com os mesmos papéis autorizados pelas rotas Express. Isso melhora a experiência, mas não substitui a autorização no backend: a API continua sendo a autoridade final.

- Alterar status: ADMIN, GERENTE, ATENDENTE, COZINHEIRO e GARCOM.
- Registrar pagamento: ADMIN, GERENTE, ATENDENTE e CAIXA.
- Consultar pedidos: CLIENTE e equipe autorizada pelo backend.

## Executar

Na pasta `frontend`:

```bash
npm install
npm run dev
```

Configure `VITE_API_URL` no `.env` se a API não estiver em `http://localhost:3000/api`.
