import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false, field: 'unit_price' },
  subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  notes: { type: DataTypes.STRING(300) }
});

export default OrderItem;
