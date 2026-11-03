import { Prato } from "../models/index.js";

// LISTAR PRATOS DISPONÍVEIS
export async function listarPratos(req, res) {
  try {
    const pratos = await Prato.findAll({
      where: { disponivel: true },
      order: [["nome", "ASC"]],
    });

    return res.status(200).json(pratos);
  } catch (erro) {
    console.error("Erro ao listar pratos:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar pratos.",
    });
  }
}

// BUSCAR PRATO POR ID
export async function buscarPrato(req, res) {
  try {
    const { id } = req.params;

    const prato = await Prato.findByPk(id);

    if (!prato) {
      return res.status(404).json({
        mensagem: "Prato não encontrado.",
      });
    }

    return res.status(200).json(prato);
  } catch (erro) {
    console.error("Erro ao buscar prato:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar prato.",
    });
  }
}

// CADASTRAR PRATO
export async function cadastrarPrato(req, res) {
  try {
    const { nome, descricao, preco } = req.body;

    if (!nome || preco === undefined) {
      return res.status(400).json({
        mensagem: "Nome e preço são obrigatórios.",
      });
    }

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) <= 0
    ) {
      return res.status(400).json({
        mensagem: "Informe um nome e um preço válido.",
      });
    }

    const prato = await Prato.create({
      nome: nome.trim(),
      descricao,
      preco: Number(preco),
      disponivel: true,
    });

    return res.status(201).json({
      mensagem: "Prato cadastrado com sucesso!",
      prato,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar prato:", erro);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar prato.",
    });
  }
}

// EDITAR PRATO
export async function atualizarPrato(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, disponivel } = req.body;

    const prato = await Prato.findByPk(id);

    if (!prato) {
      return res.status(404).json({
        mensagem: "Prato não encontrado.",
      });
    }

    if (nome !== undefined && (typeof nome !== "string" || !nome.trim())) {
      return res.status(400).json({
        mensagem: "Nome inválido.",
      });
    }

    if (
      preco !== undefined &&
      (!Number.isFinite(Number(preco)) || Number(preco) <= 0)
    ) {
      return res.status(400).json({
        mensagem: "Preço inválido.",
      });
    }

    if (disponivel !== undefined && typeof disponivel !== "boolean") {
      return res.status(400).json({
        mensagem: "Disponibilidade inválida.",
      });
    }

    await prato.update({
      ...(nome !== undefined && { nome: nome.trim() }),
      ...(descricao !== undefined && { descricao }),
      ...(preco !== undefined && { preco: Number(preco) }),
      ...(disponivel !== undefined && { disponivel }),
    });

    return res.status(200).json({
      mensagem: "Prato atualizado com sucesso!",
      prato,
    });
  } catch (erro) {
    console.error("Erro ao atualizar prato:", erro);

    return res.status(500).json({
      mensagem: "Erro ao atualizar prato.",
    });
  }
}

// DESATIVAR PRATO
export async function desativarPrato(req, res) {
  try {
    const { id } = req.params;

    const prato = await Prato.findByPk(id);

    if (!prato) {
      return res.status(404).json({
        mensagem: "Prato não encontrado.",
      });
    }

    // Não apaga do banco para preservar o histórico dos pedidos.
    await prato.update({ disponivel: false });

    return res.status(200).json({
      mensagem: "Prato desativado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao desativar prato:", erro);

    return res.status(500).json({
      mensagem: "Erro ao desativar prato.",
    });
  }
}