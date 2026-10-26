import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Permissao = sequelize.define(
  "Permissao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "permissoes",
    timestamps: false,
  }
);

export default Permissao;