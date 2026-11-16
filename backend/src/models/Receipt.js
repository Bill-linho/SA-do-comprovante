import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Receipt = sequelize.define('Receipt', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  snapshot: { type: DataTypes.JSONB, allowNull: false }
});

export default Receipt;
