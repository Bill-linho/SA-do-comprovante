import rateLimit from "express-rate-limit";

// Limite geral: 100 requisições a cada 15 minutos por IP.
export const limiteGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    mensagem: "Muitas requisições. Tente novamente mais tarde.",
  },
});

// Limite para login: 5 tentativas a cada 15 minutos por IP.
export const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    mensagem: "Muitas tentativas de login. Aguarde 15 minutos.",
  },
  skipSuccessfulRequests: true,
});