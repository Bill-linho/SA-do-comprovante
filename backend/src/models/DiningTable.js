import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const DiningTable = sequelize.define('DiningTable', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  number: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 4 },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

export default DiningTable;
