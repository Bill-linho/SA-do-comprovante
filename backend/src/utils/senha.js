import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashSenha(senha) {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

export async function compararSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}