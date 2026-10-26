import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HistoricoPedido = sequelize.define(
  "HistoricoPedido",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    acao: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status_anterior: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    status_novo: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    detalhes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "historico_pedidos",
    createdAt: "criado_em",
    updatedAt: false,
  }
);

export default HistoricoPedido;