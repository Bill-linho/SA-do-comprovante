import { Usuario, Papel, Permissao } from "../models/index.js";

export default function autorizar(permissoesNecessarias) {
  return async (req, res, next) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: [
          {
            model: Papel,
            as: "papeis",
            through: { attributes: [] },
            include: [
              {
                model: Permissao,
                as: "permissoes",
                through: { attributes: [] },
              },
            ],
          },
        ],
      });

      if (!usuario) {
        return res.status(401).json({
          mensagem: "Usuário não encontrado.",
        });
      }

      const permissoesUsuario = usuario.papeis.flatMap((papel) =>
        papel.permissoes.map((permissao) => permissao.nome)
      );

      const necessarias = Array.isArray(permissoesNecessarias)
        ? permissoesNecessarias
        : [permissoesNecessarias];

      const autorizado = necessarias.some((permissao) =>
        permissoesUsuario.includes(permissao)
      );

      if (!autorizado) {
        return res.status(403).json({
          mensagem: "Você não tem permissão para executar esta ação.",
        });
      }

      next();
    } catch (erro) {
      console.error("Erro ao verificar permissão:", erro);

      return res.status(500).json({
        mensagem: "Erro ao verificar permissões.",
      });
    }
  };
}