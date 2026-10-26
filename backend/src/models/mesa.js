import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Mesa = sequelize.define(
  "Mesa",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
    },
    status: {
      type: DataTypes.ENUM(
        "disponivel",
        "ocupada",
        "indisponivel"
      ),
      allowNull: false,
      defaultValue: "disponivel",
    },
  },
  {
    tableName: "mesas",
    timestamps: true,
  }
);

export default Mesa;