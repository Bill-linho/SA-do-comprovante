# Sistema de Restaurante

MVP full-stack com backend Express + Sequelize + PostgreSQL e frontend React + Vite.

## Requisitos
- Node.js 20+
- PostgreSQL 15+
- npm

## 1. Banco de dados
Crie um banco chamado `restaurante_db` no PostgreSQL.

## 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Edite `.env` com as credenciais do PostgreSQL e um `JWT_SECRET` forte.
O backend cria/atualiza as tabelas em desenvolvimento e cria um administrador inicial se `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` estiverem definidos.

Login inicial: use os valores configurados em `.env`. Troque a senha após o primeiro acesso.

## 3. Frontend
Em outro terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Acesse http://localhost:5173.

## Funcionalidades desta primeira entrega
- Cadastro e login de clientes.
- Login de funcionários e autorização RBAC.
- Cadastro, edição, disponibilidade de produtos e categorias (admin/gerente).
- Painel administrativo em `/admin/cardapio`.
- Cadastro, listagem, alteração de cargo e ativação/desativação de funcionários (somente ADMIN), em `/admin/funcionarios`.
- Cardápio público.
- Criação e consulta de reservas.
- Criação de pedidos por mesa.
- Atualização de status dos pedidos (equipe).
- Geração de comprovante automático do pedido em HTML para impressão/salvar em PDF pelo navegador.
- Registro de pagamento presencial no caixa (admin/gerente/caixa).

## Painel administrativo
- Entre com o usuário `ADMIN` configurado por `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.
- O menu Administração aparece para `ADMIN` e `GERENTE`.
- `ADMIN` acessa Cardápio e Funcionários; `GERENTE` acessa somente Cardápio.
- O cadastro de funcionário cria senha com hash bcrypt. O funcionário entra pela tela de login comum.
- Desativar funcionário impede novos logins sem apagar o histórico da conta.
- Produtos são ocultados por disponibilidade; não são apagados fisicamente.

## Perfis
`ADMIN`, `GERENTE`, `ATENDENTE`, `COZINHEIRO`, `GARCOM`, `CAIXA`, `CLIENTE`.

## Observações importantes
- Esta é uma base funcional de MVP, não uma solução pronta para produção.
- O comprovante é um recibo não fiscal do pedido; não substitui NFC-e/NF-e.
- Pagamento presencial é registrado pelo funcionário após receber dinheiro/cartão/Pix no caixa. Não há gateway online.
- Antes de produção: migrations versionadas, testes automatizados, rate limit, logs, HTTPS, política de backup, revisão de segurança, regras de LGPD e integração fiscal se necessária.
- Para tablet, abra o frontend em modo quiosque/tela cheia e use a rota de cardápio/pedidos; a associação de mesa é feita pelo número da mesa.

### Cadastro de clientes: CPF e telefone

O formulário de criação de conta solicita nome completo, CPF, telefone/WhatsApp, e-mail e senha. O backend normaliza o CPF e o telefone para armazenar apenas números, valida os dígitos verificadores do CPF e impede CPF duplicado. O CPF não é retornado nas respostas públicas de cadastro/login nem na listagem de funcionários.

Os campos `cpf` e `phone` já estão definidos no model `backend/src/models/User.js`. Como este projeto está em desenvolvimento e o banco ainda tem poucos dados, o servidor usa `sequelize.sync({ alter: true })` fora de produção para sincronizar as colunas automaticamente. Contas antigas permanecem válidas e terão CPF/telefone nulos até atualização cadastral. Faça backup antes de alterações importantes no banco.

**Privacidade:** CPF e telefone são dados pessoais. Restrinja o acesso ao banco e aos backups, use HTTPS em produção, não registre esses valores em logs e mantenha uma finalidade e base legal adequadas conforme a LGPD. O cadastro não substitui os registros de pedidos, consumo e pagamento necessários para documentar uma eventual cobrança.

## Instalar como aplicativo no celular (PWA)

O frontend agora pode ser instalado como aplicativo no Android e no iPhone, sem React Native.

- Publique o frontend em um endereço HTTPS (ou use `localhost` durante o desenvolvimento). O service worker não funciona em um endereço HTTP comum.
- No Android/Chrome, abra o site e toque em **Instalar aplicativo** quando o botão aparecer. Se o navegador não mostrar a opção, use o menu do Chrome e escolha **Instalar aplicativo** ou **Adicionar à tela inicial**.
- No iPhone, abra o site no Safari, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**.
- Para testar localmente, execute `npm install` e `npm run dev` na pasta `frontend`; acesse pelo próprio computador em `http://localhost:5173`. Para testar em outro celular, publique em HTTPS.

O PWA oferece instalação e cache básico da interface. Pedidos, reservas, login e demais operações continuam dependendo do backend e de conexão com a internet. O service worker não armazena respostas da API nem dados pessoais.


## Painel da cozinha

Cadastre o funcionário com o cargo `COZINHEIRO` em Administração → Funcionários. Ele entra pela mesma tela de login com e-mail e senha próprios e é direcionado automaticamente para `/cozinha`. O painel mostra pedidos recebidos e em preparo, atualiza automaticamente a cada 15 segundos e permite iniciar/finalizar o preparo. Ao marcar como pronto, o pedido sai da fila da cozinha e fica disponível para o garçom concluir a entrega na área de pedidos. A API também restringe as mudanças de status por cargo.

## Organização do código

### Backend: endpoints separados por recurso

As rotas HTTP ficam em `backend/src/routes/`, separadas por responsabilidade:

- `auth.routes.js`: cadastro e login (`/api/auth`).
- `catalog.routes.js`: categorias e produtos (`/api/categories` e `/api/products`).
- `table.routes.js`: mesas (`/api/tables`).
- `reservation.routes.js`: reservas (`/api/reservations`).
- `order.routes.js`: pedidos e seus estados/pagamentos (`/api/orders`).
- `staff.routes.js`: funcionários (`/api/staff`).
- `index.js`: reúne os módulos e mantém o prefixo `/api` configurado em `app.js`.

Os controllers continuam em `backend/src/controllers/`: eles executam as regras de negócio. Os arquivos de rotas definem os caminhos HTTP, validações e permissões.

### Frontend: estilos organizados

O CSS foi dividido em `frontend/src/styles/`:

- `base.css`: estilos gerais, cabeçalho, formulários, cardápio e elementos compartilhados.
- `admin.css`: painel administrativo e funcionários.
- `kitchen.css`: painel da cozinha.
- `pwa.css`: aviso e botão de instalação do PWA.

O arquivo `frontend/src/styles.css` é o ponto de entrada que importa os arquivos acima. O `main.jsx` continua importando somente `styles.css`.

### Sobre migrations

Migrations são arquivos versionados que registram alterações no banco de dados. Neste projeto de estudo, como o banco ainda tem poucos dados, removemos a migration específica de CPF/telefone e deixamos o Sequelize sincronizar o model automaticamente durante o desenvolvimento (`sequelize.sync({ alter: true })`). Em produção, o ideal é voltar a usar migrations e não depender de `alter: true`.


## Organização dos Models

Os models do Sequelize ficam separados em `backend/src/models/`, um arquivo por entidade:

- `User.js`: clientes e funcionários.
- `DiningTable.js`: mesas.
- `Category.js`: categorias do cardápio.
- `Product.js`: produtos/pratos.
- `Reservation.js`: reservas.
- `Order.js`: pedidos.
- `OrderItem.js`: itens de cada pedido.
- `Receipt.js`: comprovantes.

O arquivo `index.js` importa os models, configura os relacionamentos (`hasMany`, `belongsTo`, `hasOne`) e exporta tudo. Assim, controllers continuam importando os models de `../models/index.js` sem precisar alterar seus imports.

**Importante:** não apague `index.js`; ele é o ponto central que garante que os relacionamentos sejam registrados antes de os controllers usarem os models.

## Configurações de aparência

O frontend possui a página `/configuracoes`, acessível pelo menu principal. Nela é possível escolher tema claro, escuro ou automático (conforme a preferência do navegador/dispositivo), tamanho da fonte e alto contraste. As preferências ficam salvas no `localStorage` do navegador e são aplicadas novamente quando o usuário retorna.

Os arquivos dessa funcionalidade são `frontend/src/contexts/AppearanceContext.jsx`, `frontend/src/pages/SettingsPage.jsx` e `frontend/src/styles/settings.css`.
