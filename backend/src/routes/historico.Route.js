import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { listarHistorico, } from "../controllers/historicoPedido.js";

const router = Router();

router.get("/:id/historico", autenticar, autorizar("historico.visualizar"), listarHistorico );

export default router;