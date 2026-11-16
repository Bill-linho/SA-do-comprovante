import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  cpf: { type: DataTypes.STRING(11), allowNull: true, unique: true },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  role: { type: DataTypes.ENUM('ADMIN','GERENTE','ATENDENTE','COZINHEIRO','GARCOM','CAIXA','CLIENTE'), allowNull: false, defaultValue: 'CLIENTE' },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

export default User;
