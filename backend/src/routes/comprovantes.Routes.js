import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { emitirComprovante, simularPagamento } from "../controllers/comprovanteController.js";

const router = Router();

router.post("/:id/pagamento-teste", autenticar, autorizar(["pagamento.simular"]), simularPagamento);

router.get("/:id/comprovante", autenticar, emitirComprovante);

export default router;
