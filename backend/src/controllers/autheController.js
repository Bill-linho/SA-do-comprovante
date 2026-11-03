import jwt from "jsonwebtoken";
import sequelize from "../config/database.js";
import { Usuario, Papel, UsuarioPapel } from "../models/index.js";
import { hashSenha, compararSenha } from "../utils/senha.js";

export async function cadastrar(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { nome, email, senha } = req.body;

    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !nome.trim() ||
      !email.trim() ||
      senha.length < 8 ||
      senha.length > 72
    ) {
      await transaction.rollback();
      return res.status(400).json({
        mensagem: "Informe nome, email e senha válida (8 a 72 caracteres).",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const usuarioExistente = await Usuario.findOne({
      where: { email: emailNormalizado },
      transaction,
    });

    if (usuarioExistente) {
      await transaction.rollback();
      return res.status(409).json({ mensagem: "Este email já está cadastrado." });
    }

    const papelCliente = await Papel.findOne({
      where: { nome: "cliente" },
      transaction,
    });

    if (!papelCliente) {
      throw new Error('Papel "cliente" não foi inicializado. Verifique o RBAC seeder.');
    }

    const usuario = await Usuario.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha: await hashSenha(senha),
    }, { transaction });

    await UsuarioPapel.create({
      usuario_id: usuario.id,
      papel_id: papelCliente.id,
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    if (!transaction.finished) await transaction.rollback();
    console.error("Erro no cadastro:", erro);

    if (erro.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ mensagem: "Este email já está cadastrado." });
    }

    return res.status(500).json({ mensagem: "Erro ao cadastrar usuário." });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha ||
      senha.length > 72
    ) {
      return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!usuario || !(await compararSenha(senha, usuario.senha))) {
      return res.status(401).json({ mensagem: "Email ou senha incorretos." });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado.");
    }

    const token = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const dadosToken = jwt.decode(token);

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      expiraEm: new Date(dadosToken.exp * 1000).toISOString(),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json({ mensagem: "Erro ao realizar login." });
  }
}

export async function pegarUser(req, res) {
  try {
    const resultado = await Usuario.findAll({
      attributes: ["id", "nome", "email", "cpf", "telefone", "createdAt"],
      order: [["nome", "ASC"]],
    });

    return res.status(200).json({
      mensagem: "Usuários encontrados.",
      resultado,
    });
  } catch (erro) {
    console.error("Erro ao encontrar usuários:", erro);
    return res.status(500).json({ mensagem: "Erro ao encontrar usuários." });
  }
}


export async function atribuirPapel(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const usuarioId = Number(req.params.id);
    const { papel: nomePapel } = req.body;
    const papeisPermitidos = ["cliente", "atendente", "cozinheiro"];

    if (!Number.isInteger(usuarioId) || usuarioId <= 0 || !papeisPermitidos.includes(nomePapel)) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Usuário ou papel inválido." });
    }

    if (usuarioId === Number(req.usuario.id)) {
      await transaction.rollback();
      return res.status(400).json({ mensagem: "Você não pode alterar seu próprio papel." });
    }

    const usuario = await Usuario.findByPk(usuarioId, { transaction });
    const papel = await Papel.findOne({ where: { nome: nomePapel }, transaction });

    if (!usuario || !papel) {
      await transaction.rollback();
      return res.status(404).json({ mensagem: "Usuário ou papel não encontrado." });
    }

    await UsuarioPapel.destroy({
      where: { usuario_id: usuarioId },
      transaction,
    });

    await UsuarioPapel.create({
      usuario_id: usuarioId,
      papel_id: papel.id,
    }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      mensagem: "Papel do usuário atualizado.",
      usuario: { id: usuario.id, nome: usuario.nome, papel: nomePapel },
    });
  } catch (erro) {
    if (!transaction.finished) await transaction.rollback();
    console.error("Erro ao atribuir papel:", erro);
    return res.status(500).json({ mensagem: "Erro ao atualizar papel do usuário." });
  }
}
