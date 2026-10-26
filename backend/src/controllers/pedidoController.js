import sequelize from "../config/database.js";
import { Pedido } from "../models/index.js";
import { registrarHistorico } from "../services/historicoServico.js";

const statusPermitidos = [
  "aberto",
  "enviado_cozinha",
  "em_preparo",
  "pronto",
  "entregue",
  "cancelado",
];

export async function atualizarStatus(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!statusPermitidos.includes(status)) {
      await transaction.rollback();

      return res.status(400).json({
        mensagem: "Status informado é inválido.",
      });
    }

    const pedido = await Pedido.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!pedido) {
      await transaction.rollback();

      return res.status(404).json({
        mensagem: "Pedido não encontrado.",
      });
    }

    const statusAnterior = pedido.status;

    await pedido.update({ status }, { transaction });

    await registrarHistorico({
      pedidoId: pedido.id,
      usuarioId: req.usuario.id,
      acao: "pedido.status_alterado",
      statusAnterior,
      statusNovo: status,
      detalhes: {
        origem: "api",
      },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso.",
      pedido,
    });
  } catch (erro) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Erro ao atualizar pedido:", erro);

    return res.status(500).json({
      mensagem: "Erro ao atualizar pedido.",
    });
  }
}