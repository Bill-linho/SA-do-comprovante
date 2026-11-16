import User from './User.js';
import DiningTable from './DiningTable.js';
import Category from './Category.js';
import Product from './Product.js';
import Reservation from './Reservation.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Receipt from './Receipt.js';

// Relacionamentos centralizados: os models ficam definidos em arquivos próprios.
User.hasMany(Reservation, { foreignKey: { name: 'customerId', allowNull: true }, as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Reservation.belongsTo(DiningTable, { foreignKey: 'tableId', as: 'table' });
DiningTable.hasMany(Reservation, { foreignKey: 'tableId', as: 'reservations' });

Category.hasMany(Product, { foreignKey: { name: 'categoryId', allowNull: false }, as: 'products' });
Product.belongsTo(Category, { foreignKey: { name: 'categoryId', allowNull: false }, as: 'category' });

User.hasMany(Order, { foreignKey: { name: 'customerId', allowNull: true }, as: 'orders' });
Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Order.belongsTo(DiningTable, { foreignKey: 'tableId', as: 'table' });
DiningTable.hasMany(Order, { foreignKey: 'tableId', as: 'orders' });
Order.hasMany(OrderItem, { foreignKey: { name: 'orderId', allowNull: false }, as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: { name: 'orderId', allowNull: false } });
OrderItem.belongsTo(Product, { foreignKey: { name: 'productId', allowNull: false } });
Order.hasOne(Receipt, { foreignKey: { name: 'orderId', allowNull: false }, as: 'receipt' });
Receipt.belongsTo(Order, { foreignKey: { name: 'orderId', allowNull: false } });

export {
  User,
  DiningTable,
  Category,
  Product,
  Reservation,
  Order,
  OrderItem,
  Receipt
};
