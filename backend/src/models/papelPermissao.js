import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PapelPermissao = sequelize.define(
  "PapelPermissao",
  {
    papel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "papeis",
        key: "id",
      },
    },
    permissao_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "permissoes",
        key: "id",
      },
    },
  },
  {
    tableName: "papel_permissoes",
    timestamps: false,
  }
);

export default PapelPermissao;