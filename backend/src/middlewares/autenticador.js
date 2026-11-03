import jwt from "jsonwebtoken";

export default function autenticar(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token não informado." });
  }

  const token = authorization.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ mensagem: "JWT_SECRET não configurado." });
    }

    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = {
      id: dados.id ?? dados.usuarioId,
      expiraEm: new Date(dados.exp * 1000),
    };

    if (!req.usuario.id) {
      return res.status(401).json({
        mensagem: "Token não contém o ID do usuário.",
      });
    }

    return next();
  } catch {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}
