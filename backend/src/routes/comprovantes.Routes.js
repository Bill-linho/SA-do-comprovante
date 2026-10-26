import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { emitirComprovante, simularPagamento } from "../controllers/comprovanteController.js";

const router = Router();

// Endpoint de teste: simula aprovação/recusa, sem integração e sem dinheiro real.
router.post("/:id/pagamento-teste", autenticar, autorizar(["pagamento.simular"]), simularPagamento);
// Abra o PDF no navegador e use Ctrl+P para imprimir.
router.get("/:id/comprovante", autenticar, emitirComprovante);

export default router;
