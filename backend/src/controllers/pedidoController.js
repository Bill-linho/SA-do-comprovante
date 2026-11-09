import sequelize from "../config/database.js";
import {
  Pedido,
  ItemPedido,
  Prato,
  Mesa,
  Usuario,
  Papel,
} from "../models/index.js";
import { registrarHistorico } from "../services/historicoServico.js";

const statusPermitidos = [
  "aberto",
  "enviado_cozinha",
  "em_preparo",
  "pronto",
  "entregue",
  "cancelado",
];

const metodosPagamento = ["dinheiro", "pix", "cartao_credito", "cartao_debito"];

async function papeisDoUsuario(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId, {
    include: [{ model: Papel, as: "papeis", through: { attributes: [] } }],
  });
  return usuario?.papeis?.map((papel) => papel.nome) ?? [];
}

function incluirItens() {
  return [{
    model: ItemPedido,
    as: "itens",
    include: [{ model: Prato, as: "prato", attributes: ["id", "nome", "descricao"] }],
  }];
}

// POST /pedidos
export async function criarPedido(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { itens, mesa_id, metodo_pagamento } = req.body;

    if (!Array.isArray(itens) || itens.length === 0 || itens.length > 30) {
      await transaction.rollback();
      return res.status(400).json({
        mensagem: "Informe entre 1 e 30 itens no pedido.",
      });
    }

    if (metodo_pagamento && !metodosPagamento.includes(metodo_pagamento)) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Método de pagamento inválido." });
    }

    for (const item of itens) {
      if (
        !Number.isInteger(Number(item.prato_id)) ||
        Number(item.prato_id) <= 0 ||
        !Number.isInteger(Number(item.quantidade)) ||
        Number(item.quantidade) < 1 ||
        Number(item.quantidade) > 50
      ) {
        await transaction.rollback();
        return res.status(400).json({
          mensagem: "Cada item precisa ter prato_id válido e quantidade entre 1 e 50.",
        });
      }
    }

    if (mesa_id !== undefined && mesa_id !== null) {
      if (!Number.isInteger(Number(mesa_id)) || Number(mesa_id) <= 0) {
        await transaction.rollback();
        return res.status(400).json({ mensagem: "Mesa inválida." });
      }

      const mesa = await Mesa.findByPk(Number(mesa_id), {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!mesa || mesa.status !== "disponivel") {
        await transaction.rollback();
        return res.status(409).json({ mensagem: "Mesa não encontrada ou indisponível." });
      }
    }

    const ids = [...new Set(itens.map((item) => Number(item.prato_id)))];
    const pratos = await Prato.findAll({
      where: { id: ids, disponivel: true },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (pratos.length !== ids.length) {
      await transaction.rollback();
      return res.status(400).json({
        mensagem: "Um ou mais pratos não existem ou estão indisponíveis.",
      });
    }

    const pratosPorId = new Map(pratos.map((prato) => [prato.id, prato]));
    let totalCentavos = 0;

    const itensParaCriar = itens.map((item) => {
      const prato = pratosPorId.get(Number(item.prato_id));
      const precoCentavos = Math.round(Number(prato.preco) * 100);
      totalCentavos += precoCentavos * Number(item.quantidade);

      return {
        prato_id: prato.id,
        quantidade: Number(item.quantidade),
        preco_unitario: (precoCentavos / 100).toFixed(2),
      };
    });

    if (!Number.isSafeInteger(totalCentavos) || totalCentavos <= 0) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Valor total do pedido inválido." });
    }

    const pedido = await Pedido.create({
      cliente_id: req.usuario.id,
      mesa_id: mesa_id == null ? null : Number(mesa_id),
      valor_total: (totalCentavos / 100).toFixed(2),
      pagamento_metodo: metodo_pagamento ?? null,
      status: "aberto",
      pagamento_status: "pendente",
    }, { transaction });

    await ItemPedido.bulkCreate(
      itensParaCriar.map((item) => ({ ...item, pedido_id: pedido.id })),
      { transaction }
    );

    await registrarHistorico({
      pedidoId: pedido.id,
      usuarioId: req.usuario.id,
      acao: "pedido.criado",
      statusNovo: "aberto",
      detalhes: {
        quantidade_itens: itensParaCriar.length,
        valor_total: (totalCentavos / 100).toFixed(2),
      },
      transaction,
    });

    await transaction.commit();

    const pedidoCompleto = await Pedido.findByPk(pedido.id, {
      include: incluirItens(),
    });

    return res.status(201).json({
      mensagem: "Pedido criado com sucesso.",
      pedido: pedidoCompleto,
    });
  } catch (erro) {
    if (!transaction.finished) await transaction.rollback();
    console.error("Erro ao criar pedido:", erro);
    return res.status(500).json({ mensagem: "Erro ao criar pedido." });
  }
}

// GET /pedidos/meus
export async function listarMeusPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { cliente_id: req.usuario.id },
      include: incluirItens(),
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(pedidos);
  } catch (erro) {
    console.error("Erro ao listar pedidos do cliente:", erro);
    return res.status(500).json({ mensagem: "Erro ao listar seus pedidos." });
  }
}



// GET /pedidos/cozinha
export async function listarPedidosCozinha(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      where: { status: ["aberto", "enviado_cozinha", "em_preparo"] },
      include: [
        { model: Usuario, as: "cliente", attributes: ["id", "nome"] },
        ...incluirItens(),
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json(pedidos);
  } catch (erro) {
    console.error("Erro ao listar fila da cozinha:", erro);
    return res.status(500).json({ mensagem: "Erro ao consultar a fila da cozinha." });
  }
}

// GET /pedidos (equipe)
export async function listarTodosPedidos(req, res) {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        { model: Usuario, as: "cliente", attributes: ["id", "nome", "telefone"] },
        ...incluirItens(),
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(pedidos);
  } catch (erro) {
    console.error("Erro ao listar pedidos:", erro);
    return res.status(500).json({ mensagem: "Erro ao listar pedidos." });
  }
}

// GET /pedidos/:id
export async function buscarPedido(req, res) {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: incluirItens(),
    });

    if (!pedido) {
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

    const papeis = await papeisDoUsuario(req.usuario.id);
    const equipe = papeis.some((papel) =>
      ["atendente", "cozinheiro", "gerente", "admin"].includes(papel)
    );

    if (!equipe && Number(pedido.cliente_id) !== Number(req.usuario.id)) {
      return res.status(403).json({
        mensagem: "Você só pode consultar seus próprios pedidos.",
      });
    }

    return res.status(200).json(pedido);
  } catch (erro) {
    console.error("Erro ao buscar pedido:", erro);
    return res.status(500).json({ mensagem: "Erro ao buscar pedido." });
  }
}

// PATCH /pedidos/:id/status (equipe autorizada)
export async function atualizarStatus(req, res) {
  let transaction;

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ mensagem: "Status informado é inválido." });
    }

    const papeis = await papeisDoUsuario(req.usuario.id);
    const somenteCozinha = papeis.includes("cozinheiro") &&
      !papeis.some((papel) => ["atendente", "gerente", "admin"].includes(papel));

    if (somenteCozinha && !["em_preparo", "pronto"].includes(status)) {
      return res.status(403).json({
        mensagem: "A cozinha só pode mover pedidos para 'em_preparo' ou 'pronto'.",
      });
    }

    transaction = await sequelize.transaction();

    const pedido = await Pedido.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

    if (pedido.status === "cancelado" || pedido.status === "entregue") {
      await transaction.rollback();
      return res.status(409).json({
        mensagem: "Não é possível alterar um pedido cancelado ou já entregue.",
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
      detalhes: { origem: "api" },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso.",
      pedido,
    });
  } catch (erro) {
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("Erro ao atualizar pedido:", erro);
    return res.status(500).json({ mensagem: "Erro ao atualizar pedido." });
  }
}

// PATCH /pedidos/:id/cancelar (cliente dono, enquanto ainda aberto e não pago)
export async function cancelarMeuPedido(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

    if (Number(pedido.cliente_id) !== Number(req.usuario.id)) {
      await transaction.rollback();
      return res.status(403).json({ mensagem: "Você só pode cancelar seus próprios pedidos." });
    }

    if (pedido.status !== "aberto" || pedido.pagamento_status === "aprovado") {
      await transaction.rollback();
      return res.status(409).json({
        mensagem: "Este pedido não pode mais ser cancelado pelo cliente.",
      });
    }

    await pedido.update({ status: "cancelado" }, { transaction });

    await registrarHistorico({
      pedidoId: pedido.id,
      usuarioId: req.usuario.id,
      acao: "pedido.cancelado_pelo_cliente",
      statusAnterior: "aberto",
      statusNovo: "cancelado",
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      mensagem: "Pedido cancelado com sucesso.",
      pedido,
    });
  } catch (erro) {
    if (!transaction.finished) await transaction.rollback();
    console.error("Erro ao cancelar pedido:", erro);
    return res.status(500).json({ mensagem: "Erro ao cancelar pedido." });
  }
}
