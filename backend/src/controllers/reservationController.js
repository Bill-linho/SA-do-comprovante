import { Op } from 'sequelize';
import { Reservation, DiningTable } from '../models/index.js';
export async function createReservation(req, res) {
  const data = req.validated.body;
  const date = new Date(data.dateTime);
  if (date <= new Date()) return res.status(400).json({ message: 'Escolha uma data futura.' });
  let table = null;
  if (data.tableId) {
    table = await DiningTable.findOne({ where: { id: data.tableId, active: true, capacity: { [Op.gte]: data.people } } });
    if (!table) return res.status(400).json({ message: 'Mesa inexistente ou com capacidade insuficiente.' });
    const start = new Date(date.getTime() - 2 * 60 * 60 * 1000);
    const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const conflict = await Reservation.findOne({ where: { tableId: table.id, status: ['PENDENTE','CONFIRMADA'], dateTime: { [Op.between]: [start, end] } } });
    if (conflict) return res.status(409).json({ message: 'Mesa indisponível nesse horário.' });
  }
  const reservation = await Reservation.create({ ...data, customerId: req.user.id });
  res.status(201).json(reservation);
}
export async function listReservations(req, res) {
  const where = req.user.role === 'CLIENTE' ? { customerId: req.user.id } : {};
  res.json(await Reservation.findAll({ where, include: [{ model: DiningTable, as: 'table' }], order: [['dateTime','ASC']] }));
}
export async function updateReservation(req, res) {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Reserva não encontrada.' });
  if (req.user.role === 'CLIENTE' && reservation.customerId !== req.user.id) return res.status(403).json({ message: 'Sem permissão.' });
  const allowed = req.user.role === 'CLIENTE' ? ['CANCELADA'] : ['PENDENTE','CONFIRMADA','CANCELADA','CONCLUIDA'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Status inválido.' });
  await reservation.update({ status: req.body.status });
  res.json(reservation);
}
