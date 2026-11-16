import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

function isValidCpf(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digits = cpf.split('').map(Number);
  const calc = (length) => {
    const sum = digits.slice(0, length).reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return calc(9) === digits[9] && calc(10) === digits[10];
}

export async function register(req, res) {
  try {
    const { name, password, phone } = req.validated.body;
    const email = req.validated.body.email.trim().toLowerCase();
    const cpf = req.validated.body.cpf.replace(/\D/g, '');
    if (!isValidCpf(cpf)) return res.status(400).json({ message: 'CPF inválido.' });
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'E-mail já cadastrado.' });
    if (await User.findOne({ where: { cpf } })) return res.status(409).json({ message: 'Este CPF já possui cadastro.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), cpf, phone: phone.replace(/\D/g, ''), passwordHash, role: 'CLIENTE' });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) { return res.status(500).json({ message: 'Erro ao cadastrar usuário.' }); }
}

export async function login(req, res) {
  const { password } = req.validated.body;
  // E-mails não diferenciam maiúsculas de minúsculas.
  const normalizedEmail = req.validated.body.email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }
  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: String(user.id), expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
