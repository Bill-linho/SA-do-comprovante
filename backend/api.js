import express from "express";
import helmet from "helmet";
import cors from "cors";

import sequelize from "./config/database.js";
import "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import pedidoRoutes from "./routes/pedidoRoutes.js";
import historicoRoutes from "./routes/historicoRoutes.js";

import { limiteGlobal } from "./middlewares/rateLimit.js";
import { executarRbacSeeder } from "./seeders/rbacSeeder.js";

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