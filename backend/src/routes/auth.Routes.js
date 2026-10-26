import { Router } from "express";
import { cadastrar, login } from "../controllers/autheController.js";
import { limiteLogin } from "../middlewares/rateLimit.js";
import { validar } from "../middlewares/validador.js";
import {
  cadastroSchema,
  loginSchema,
} from "../schemas/authSchems.js";

const router = Router();

router.post("/cadastro", validar(cadastroSchema), cadastrar);

router.post("/login", limiteLogin, validar(loginSchema), login);

export default router;
