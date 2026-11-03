import { Router } from "express";
import autenticar from "../middlewares/autenticador.js";
import autorizar from "../middlewares/autorizador.js";
import { pegarUser, atribuirPapel } from "../controllers/autheController.js";

const router = Router();

router.get("/usuarios", autenticar, autorizar("usuario.gerenciar"), pegarUser);

router.patch("/usuarios/:id/papel", autenticar, autorizar("usuario.gerenciar"), atribuirPapel);

export default router;
