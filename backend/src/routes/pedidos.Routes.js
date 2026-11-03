import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { criarPedido, listarMeusPedidos, listarTodosPedidos, listarPedidosCozinha, buscarPedido, atualizarStatus, cancelarMeuPedido,} from "../controllers/pedidoController.js";

const router = Router();

// Cliente autenticado
router.post("/", autenticar, autorizar("pedido.criar"), criarPedido);
router.get("/meus", autenticar, autorizar("pedido.visualizar_proprio"), listarMeusPedidos);
router.patch("/:id/cancelar", autenticar, cancelarMeuPedido);

// Equipe: cozinha e atendimento
router.get("/cozinha", autenticar, autorizar("cozinha.visualizar"), listarPedidosCozinha);
router.get("/", autenticar, autorizar("pedido.visualizar_todos"), listarTodosPedidos);
router.patch(
  "/:id/status",
  autenticar,
  autorizar(["cozinha.atualizar_status", "pedido.atualizar"]),
  atualizarStatus
);

// Detalhe: cliente dono ou equipe
router.get("/:id", autenticar, buscarPedido);

export default router;
