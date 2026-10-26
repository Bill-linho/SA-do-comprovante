import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";
import { hashSenha, compararSenha } from "../utils/senha.js";

export async function cadastrar(req, res) {
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
      return res.status(400).json({
        mensagem: "Informe nome, email e senha válida (8 a 72 caracteres).",
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await Usuario.findOne({
      where: { email: emailNormalizado },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    const senhaHash = await hashSenha(senha);

    const usuario = await Usuario.create({
      nome: nome.trim(),
      email: emailNormalizado,
      senha: senhaHash,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
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
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios.",
      });
    }

    const usuario = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (
      !usuario ||
      !(await compararSenha(senha, usuario.senha))
    ) {
      return res.status(401).json({
        mensagem: "Email ou senha incorretos.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado.");
    }

    const token = jwt.sign(
      { usuarioId: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);

    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
}