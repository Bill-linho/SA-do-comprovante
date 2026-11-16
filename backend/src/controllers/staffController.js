import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const STAFF_ROLES = ['GERENTE', 'ATENDENTE', 'COZINHEIRO', 'GARCOM', 'CAIXA'];

export async function listStaff(req, res) {
  const staff = await User.findAll({
    where: { role: STAFF_ROLES },
    attributes: ['id', 'name', 'email', 'role', 'active', 'createdAt'],
    order: [['name', 'ASC']]
  });
  res.json(staff);
}

export async function createStaff(req, res) {
  const { name, email, password, role } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8 || !STAFF_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Informe nome, e-mail, senha (mínimo 8 caracteres) e cargo válido.' });
  }
  if (await User.findOne({ where: { email: email.trim().toLowerCase() } })) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
    role
  });
  res.status(201).json({
    id: user.id, name: user.name, email: user.email,
    role: user.role, active: user.active, createdAt: user.createdAt
  });
}

export async function updateStaff(req, res) {
  const user = await User.findOne({ where: { id: req.params.id, role: STAFF_ROLES } });
  if (!user) return res.status(404).json({ message: 'Funcionário não encontrado.' });

  const { active, role, name } = req.body;
  if (active !== undefined && typeof active !== 'boolean') {
    return res.status(400).json({ message: 'O campo active deve ser verdadeiro ou falso.' });
  }
  if (role !== undefined && !STAFF_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Cargo inválido.' });
  }
  if (name !== undefined && (!name.trim() || name.length > 120)) {
    return res.status(400).json({ message: 'Nome inválido.' });
  }
  await user.update({
    ...(active !== undefined ? { active } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(name !== undefined ? { name: name.trim() } : {})
  });
  res.json({
    id: user.id, name: user.name, email: user.email,
    role: user.role, active: user.active, createdAt: user.createdAt
  });
}
