import express from "express";
import helmet from "helmet";
import cors from "cors";

import sequelize from "./src/config/database.js";
import "./src/models/index.js";

import authRoutes from "./src/routes/auth.Routes.js";
import pedidoRoutes from "./src/routes/pedidos.Routes.js";
import historicoRoutes from "./src/routes/historico.Route.js";

import { limiteGlobal } from "./src/middlewares/rateLimit.js";
import { executarRbacSeeder } from "./src/seeders/rbacSeeder.js";

const app = express();

// Se estiver atrás de um proxy confiável, como no Render,
// configure trust proxy conforme a infraestrutura.
// Não habilite indiscriminadamente em qualquer ambiente.

// Cabeçalhos HTTP de segurança.
app.use(helmet());

// Permite requisições do frontend autorizado.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Limita o tamanho do JSON recebido.
app.use(express.json({ limit: "10kb" }));

// Limite geral da API.
app.use(limiteGlobal);

// Rotas.
app.use("/auth", authRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/pedidos", historicoRoutes);

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado!");

    // Adequado para um ambiente de desenvolvimento inicial.
    // Em produção, prefira migrations.
    await sequelize.sync();

    await executarRbacSeeder();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (erro) {
    console.error("Erro ao iniciar servidor:", erro);
    process.exit(1);
  }
}

iniciarServidor();