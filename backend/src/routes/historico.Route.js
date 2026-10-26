import { Router } from "express";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";
import { listarHistorico, } from "../controllers/historicoController.js";

const router = Router();

router.get("/:id/historico", autenticar, autorizar("historico.visualizar"), listarHistorico );

export default router;