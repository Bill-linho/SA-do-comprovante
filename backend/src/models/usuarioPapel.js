import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UsuarioPapel = sequelize.define(
  "UsuarioPapel",
  {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    papel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "papeis",
        key: "id",
      },
    },
  },
  {
    tableName: "usuario_papeis",
    timestamps: false,
  }
);

export default UsuarioPapel;