import { Router } from "express";

import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";

import { listarPratos, buscarPrato, cadastrarPrato, atualizarPrato, desativarPrato} from "../controllers/pratoController.js";

const router = Router();

// Rotas públicas
router.get("/", listarPratos);
router.get("/:id", buscarPrato);

// Rotas exclusivas do gerente
router.post(
  "/",
  autenticar,
  autorizar(["produto.gerenciar"]),
  cadastrarPrato
);

router.put(
  "/:id",
  autenticar,
  autorizar(["produto.gerenciar"]),
  atualizarPrato
);

router.delete(
  "/:id",
  autenticar,
  autorizar(["produto.gerenciar"]),
  desativarPrato
);

export default router;