import { HistoricoPedido, Usuario } from "../models/index.js";

export async function listarHistorico(req, res) {
  try {
    const { id } = req.params;

    const historico = await HistoricoPedido.findAll({
      where: {
        pedido_id: id,
      },
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nome"],
          required: false,
        },
      ],
      order: [["criado_em", "ASC"]],
    });

    return res.status(200).json(historico);
  } catch (erro) {
    console.error("Erro ao consultar histórico:", erro);

    return res.status(500).json({
      mensagem: "Erro ao consultar histórico.",
    });
  }
}