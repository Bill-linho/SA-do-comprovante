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
        mesa_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        // Pagamento simulado para desenvolvimento; não representa uma transação real.
        pagamento_status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: "pendente",
            validate: { isIn: [["pendente", "aprovado", "recusado", "estornado"]] },
        },
        pagamento_metodo: {
            type: DataTypes.STRING(30),
            allowNull: true,
            validate: { isIn: [["dinheiro", "pix", "cartao_credito", "cartao_debito"]] },
        },
        pagamento_fake_id: {
            type: DataTypes.STRING(40),
            allowNull: true,
            unique: true,
        },
        pago_em: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "pedidos",
        timestamps: true,
    }
);

export default Pedido;