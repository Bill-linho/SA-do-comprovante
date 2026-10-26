import { Router } from "express";
import { cadastrar, login } from "../controllers/authController.js";
import { limiteLogin } from "../middlewares/rateLimit.js";

const router = Router();

router.post("/cadastro", cadastrar);
router.post("/login", limiteLogin, login);

export default router;