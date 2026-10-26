import jwt from "jsonwebtoken";

export default function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      mensagem: "Token não informado.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    // O token deve conter o ID do usuário.
    req.usuario = {
      id: dados.id ?? dados.usuarioId,
    };

    if (!req.usuario.id) {
      return res.status(401).json({
        mensagem: "Token não contém o ID do usuário.",
      });
    }

    next();
  } catch {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}