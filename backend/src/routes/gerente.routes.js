import { Router } from "express";
import autenticar from "../middlewares/autenticador.js"
import autorizar from "../middlewares/autorizador.js"
import { limiteGlobal } from "../middlewares/rateLimit.js"
import { pegarUser } from "../controllers/autheController.js";

const router = Router()

router.get("/Users", limiteGlobal, autenticar, autorizar("usuario.gerenciar"), pegarUser)

export default router