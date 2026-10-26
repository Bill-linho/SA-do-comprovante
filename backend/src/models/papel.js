import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Papel = sequelize.define(
  "Papel",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "papeis",
    timestamps: false,
  }
);

export default Papel;