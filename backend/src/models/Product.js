import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING(500), field: 'image_url' },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

export default Product;
