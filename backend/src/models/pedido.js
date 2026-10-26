import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    atendente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "aberto",
        "enviado_cozinha",
        "em_preparo",
        "pronto",
        "entregue",
        "cancelado"
      ),
      allowNull: false,
      defaultValue: "aberto",
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "pedidos",
    timestamps: true,
  }
);

export default Pedido;