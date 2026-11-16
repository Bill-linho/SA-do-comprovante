import { sequelize } from '../config/database.js';
import { DiningTable, Order, OrderItem, Product, Receipt, User } from '../models/index.js';

export async function createOrder(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const { tableId, items, notes } = req.validated.body;
    const table = await DiningTable.findOne({ where: { id: tableId, active: true }, transaction });
    if (!table) { await transaction.rollback(); return res.status(404).json({ message: 'Mesa não encontrada.' }); }
    const ids = [...new Set(items.map(i => i.productId))];
    const products = await Product.findAll({ where: { id: ids, available: true }, transaction });
    if (products.length !== ids.length) { await transaction.rollback(); return res.status(400).json({ message: 'Um ou mais produtos estão indisponíveis.' }); }
    const byId = new Map(products.map(p => [p.id, p]));
    const total = items.reduce((sum, item) => sum + Number(byId.get(item.productId).price) * item.quantity, 0);
    const order = await Order.create({ tableId, customerId: req.user.role === 'CLIENTE' ? req.user.id : null, notes, total }, { transaction });
    for (const item of items) {
      const product = byId.get(item.productId);
      await OrderItem.create({ orderId: order.id, productId: product.id, quantity: item.quantity, unitPrice: product.price, subtotal: Number(product.price) * item.quantity, notes: item.notes }, { transaction });
    }
    const snapshot = {
      restaurant: 'Restaurante',
      orderId: order.id,
      code: `PED-${String(order.id).padStart(6,'0')}`,
      createdAt: order.createdAt,
      table: table.number,
      customer: req.user.name,
      items: items.map(i => ({ name: byId.get(i.productId).name, quantity: i.quantity, unitPrice: Number(byId.get(i.productId).price), subtotal: Number(byId.get(i.productId).price) * i.quantity, notes: i.notes || '' })),
      total
    };
    const receipt = await Receipt.create({ orderId: order.id, code: snapshot.code, snapshot }, { transaction });
    await transaction.commit();
    res.status(201).json({ order, receipt });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Não foi possível criar o pedido.' });
  }
}
export async function listOrders(req, res) {
  const where = req.user.role === 'CLIENTE' ? { customerId: req.user.id } : {};
  const orders = await Order.findAll({ where, include: [{ model: OrderItem, as: 'items', include: [Product] }, { model: DiningTable, as: 'table' }, { model: Receipt, as: 'receipt' }, { model: User, as: 'customer', attributes: ['id','name','email'] }], order: [['createdAt','DESC']] });
  res.json(orders);
}
export async function updateOrderStatus(req, res) {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
  const nextStatus = req.body.status;
  const role = req.user.role;

  // Cozinha só controla o preparo; a entrega é responsabilidade do garçom.
  if (role === 'COZINHEIRO') {
    const allowed = {
      RECEBIDO: ['EM_PREPARACAO'],
      EM_PREPARACAO: ['PRONTO']
    };
    if (!allowed[order.status]?.includes(nextStatus)) {
      return res.status(403).json({ message: 'A cozinha só pode iniciar o preparo e marcar o pedido como pronto.' });
    }
  } else if (role === 'GARCOM') {
    if (nextStatus !== 'ENTREGUE' || order.status !== 'PRONTO') {
      return res.status(403).json({ message: 'O garçom só pode marcar como entregue um pedido que já está pronto.' });
    }
  } else if (!['ADMIN','GERENTE','ATENDENTE'].includes(role)) {
    return res.status(403).json({ message: 'Você não tem permissão para alterar este pedido.' });
  }

  const statuses = ['RECEBIDO','EM_PREPARACAO','PRONTO','ENTREGUE','CANCELADO'];
  if (!statuses.includes(nextStatus)) return res.status(400).json({ message: 'Status inválido.' });
  await order.update({ status: nextStatus });
  res.json(order);
}
export async function registerPayment(req, res) {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
  if (order.paymentStatus === 'PAGO') return res.status(409).json({ message: 'Pedido já pago.' });
  const method = req.body.method;
  if (!['DINHEIRO','CARTAO','PIX'].includes(method)) return res.status(400).json({ message: 'Forma de pagamento inválida.' });
  await order.update({ paymentStatus: 'PAGO', paymentMethod: method });
  res.json({ message: 'Pagamento presencial registrado.', order });
}
export async function getReceipt(req, res) {
  const receipt = await Receipt.findOne({ where: { id: req.params.id }, include: [{ model: Order, include: [{ model: User, as: 'customer', attributes: ['id','name'] }] }] });
  if (!receipt) return res.status(404).json({ message: 'Comprovante não encontrado.' });
  if (req.user.role === 'CLIENTE' && receipt.Order?.customerId !== req.user.id) return res.status(403).json({ message: 'Sem permissão.' });
  res.json(receipt);
}
