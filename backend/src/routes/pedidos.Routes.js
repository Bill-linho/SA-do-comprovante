import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { atualizarStatus } from "../controllers/pedidoController.js";

const router = Router();

router.patch("/:id/status", autenticar, autorizar([ "cozinha.atualizar_status", "pedido.atualizar",]), atualizarStatus );

export default router;