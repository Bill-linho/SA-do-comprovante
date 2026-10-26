import express from "express";
import sequelize from "./database.js";
import "./models/Usuario.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API funcionando!" });
});

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000");
    });
  } catch (erro) {
    console.error("Erro ao conectar ao banco:", erro);
  }
}

iniciarServidor();