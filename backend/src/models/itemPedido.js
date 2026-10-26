import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemPedido = sequelize.define(
  "ItemPedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prato_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "itens_pedido",
    timestamps: true,
  }
);

export default ItemPedido;