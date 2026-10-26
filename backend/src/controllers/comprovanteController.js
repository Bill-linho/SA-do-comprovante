import { randomUUID } from "node:crypto";
import sequelize from "../config/database.js";
import { Pedido, Usuario, Papel, Mesa, ItemPedido, Prato } from "../models/index.js";
import { registrarHistorico } from "../services/historicoServico.js";
import { gerarPdf } from "../services/pdfServico.js";

const metodos = ["dinheiro", "pix", "cartao_credito", "cartao_debito"];
const papeisEquipe = ["atendente", "gerente", "admin", "cozinheiro"];

async function papeisDoUsuario(usuarioId) {
  const usuario = await Usuario.findByPk(usuarioId, {
    include: [{ model: Papel, as: "papeis", through: { attributes: [] } }],
  });
  return usuario?.papeis?.map((papel) => papel.nome) ?? [];
}

export async function simularPagamento(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const metodo = req.body?.metodo;
    const resultado = req.body?.resultado ?? "aprovado";

    if (!metodos.includes(metodo)) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Método inválido. Use dinheiro, pix, cartao_credito ou cartao_debito." });
    }
    if (!["aprovado", "recusado"].includes(resultado)) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Resultado de teste deve ser aprovado ou recusado." });
    }

    const pedido = await Pedido.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }
    if (pedido.status === "cancelado") {
      await transaction.rollback();
      return res.status(409).json({ mensagem: "Não é possível pagar um pedido cancelado." });
    }
    if (pedido.pagamento_status === "aprovado") {
      await transaction.rollback();
      return res.status(409).json({ mensagem: "Este pedido já tem pagamento aprovado.", pagamento_status: pedido.pagamento_status });
    }

    const fakeId = `TESTE-${randomUUID()}`;
    await pedido.update({
      pagamento_status: resultado,
      pagamento_metodo: metodo,
      pagamento_fake_id: fakeId,
      pago_em: resultado === "aprovado" ? new Date() : null,
    }, { transaction });

    await registrarHistorico({
      pedidoId: pedido.id,
      usuarioId: req.usuario.id,
      acao: `pagamento_teste.${resultado}`,
      detalhes: { metodo, referencia: fakeId, valor: pedido.valor_total, ambiente: "simulacao" },
      transaction,
    });

    await transaction.commit();
    return res.status(200).json({
      mensagem: resultado === "aprovado" ? "Pagamento simulado como aprovado." : "Pagamento simulado como recusado.",
      aviso: "SIMULAÇÃO: nenhum dinheiro real foi movimentado.",
      pedido_id: pedido.id,
      valor: pedido.valor_total,
      pagamento_status: pedido.pagamento_status,
      metodo: pedido.pagamento_metodo,
      referencia_teste: pedido.pagamento_fake_id,
      pago_em: pedido.pago_em,
    });
  } catch (erro) {
    if (!transaction.finished) await transaction.rollback();
    console.error("Erro na simulação de pagamento:", erro);
    return res.status(500).json({ mensagem: "Não foi possível simular o pagamento." });
  }
}

export async function emitirComprovante(req, res) {
  try {
    const tipo = req.query.tipo === "cozinha" ? "cozinha" : "cliente";
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Mesa, as: "mesa" },
        { model: Usuario, as: "cliente", attributes: ["id", "nome", "cpf", "telefone", "email"] },
        { model: ItemPedido, as: "itens", include: [{ model: Prato, as: "prato", attributes: ["id", "nome", "preco"] }] },
      ],
    });
    if (!pedido) return res.status(404).json({ mensagem: "Pedido não encontrado." });

    const papeis = await papeisDoUsuario(req.usuario.id);
    const equipe = papeis.some((papel) => papeisEquipe.includes(papel));
    const clienteDoPedido = Number(pedido.cliente_id) === Number(req.usuario.id);

    if (tipo === "cozinha" && !papeis.some((papel) => ["cozinheiro", "atendente", "gerente", "admin"].includes(papel))) {
      return res.status(403).json({ mensagem: "Somente a equipe pode emitir a via da cozinha." });
    }
    if (tipo === "cliente" && !equipe && !clienteDoPedido) {
      return res.status(403).json({ mensagem: "Você só pode consultar comprovantes dos seus próprios pedidos." });
    }

    const linhas = tipo === "cozinha"
      ? [
          "VIA DA COZINHA - NAO FISCAL",
          `Pedido: #${pedido.id}`,
          `Mesa: ${pedido.mesa?.numero ?? "Balcao/nao informada"}`,
          `Recebido em: ${pedido.createdAt.toLocaleString("pt-BR")}`,
          `Status: ${pedido.status}`,
          "----------------------------------------",
          "ITENS DO PEDIDO:",
          ...(pedido.itens ?? []).map((item) => `${item.quantidade}x ${item.prato?.nome ?? `Prato ${item.prato_id}`}`),
          "----------------------------------------",
          "Conferencia da cozinha: __________________",
          "Este documento nao e comprovante de pagamento.",
        ]
      : [
          "COMPROVANTE DE PEDIDO - NAO FISCAL",
          `Pedido: #${pedido.id}`,
          `Data: ${pedido.createdAt.toLocaleString("pt-BR")}`,
          `Cliente: ${pedido.cliente?.nome ?? "Nao informado"}`,
          `Mesa: ${pedido.mesa?.numero ?? "Balcao/nao informada"}`,
          "----------------------------------------",
          "ITENS:",
          ...(pedido.itens ?? []).map((item) => {
            const total = Number(item.preco_unitario) * Number(item.quantidade);
            return `${item.quantidade}x ${item.prato?.nome ?? `Prato ${item.prato_id}`} - R$ ${total.toFixed(2)}`;
          }),
          "----------------------------------------",
          `TOTAL DO PEDIDO: R$ ${Number(pedido.valor_total).toFixed(2)}`,
          `Pagamento: ${pedido.pagamento_status}`,
          `Metodo: ${pedido.pagamento_metodo ?? "nao informado"}`,
          ...(pedido.pagamento_status === "aprovado" ? [`Referencia de teste: ${pedido.pagamento_fake_id}`, `Pago em: ${pedido.pago_em ? pedido.pago_em.toLocaleString("pt-BR") : "nao informado"}`] : []),
          "ATENCAO: pagamento de teste, sem valor financeiro real.",
          "Documento informativo; nao substitui nota fiscal.",
        ];

    const pdf = gerarPdf(linhas);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${tipo}-pedido-${pedido.id}.pdf"`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(pdf);
  } catch (erro) {
    console.error("Erro ao gerar comprovante:", erro);
    return res.status(500).json({ mensagem: "Não foi possível gerar o comprovante." });
  }
}
