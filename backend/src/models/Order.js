import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.ENUM('RECEBIDO','EM_PREPARACAO','PRONTO','ENTREGUE','CANCELADO'), defaultValue: 'RECEBIDO' },
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  paymentStatus: { type: DataTypes.ENUM('PENDENTE','PAGO'), defaultValue: 'PENDENTE', field: 'payment_status' },
  paymentMethod: { type: DataTypes.ENUM('DINHEIRO','CARTAO','PIX'), allowNull: true, field: 'payment_method' },
  notes: { type: DataTypes.STRING(500) }
});

export default Order;
