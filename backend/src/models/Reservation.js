import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  dateTime: { type: DataTypes.DATE, allowNull: false, field: 'date_time' },
  people: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('PENDENTE','CONFIRMADA','CANCELADA','CONCLUIDA'), defaultValue: 'PENDENTE' },
  notes: { type: DataTypes.STRING(500) }
});

export default Reservation;
