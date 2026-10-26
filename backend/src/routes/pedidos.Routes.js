import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";
import { atualizarStatus } from "../controllers/pedidoController.js";

const router = Router();

router.patch("/:id/status", autenticar, autorizar("pedido.atualizar"), atualizarStatus );

export default router;