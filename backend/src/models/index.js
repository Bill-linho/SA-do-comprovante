import Usuario from "./cliente.js";
import Papel from "./papel.js";
import Permissao from "./permissao.js";
import UsuarioPapel from "./usuarioPapel.js";
import PapelPermissao from "./papelPermissao.js";
import Pedido from "./pedido.js";
import HistoricoPedido from "./historicoPedido.js";

// Usuários <-> Papéis
Usuario.belongsToMany(Papel, {
  through: UsuarioPapel,
  foreignKey: "usuario_id",
  otherKey: "papel_id",
  as: "papeis",
});

Papel.belongsToMany(Usuario, {
  through: UsuarioPapel,
  foreignKey: "papel_id",
  otherKey: "usuario_id",
  as: "usuarios",
});

// Papéis <-> Permissões
Papel.belongsToMany(Permissao, {
  through: PapelPermissao,
  foreignKey: "papel_id",
  otherKey: "permissao_id",
  as: "permissoes",
});

Permissao.belongsToMany(Papel, {
  through: PapelPermissao,
  foreignKey: "permissao_id",
  otherKey: "papel_id",
  as: "papeis",
});

// Pedido <-> Histórico
Pedido.hasMany(HistoricoPedido, {
  foreignKey: "pedido_id",
  as: "historico",
});

HistoricoPedido.belongsTo(Pedido, {
  foreignKey: "pedido_id",
  as: "pedido",
});

// Usuário <-> Histórico
Usuario.hasMany(HistoricoPedido, {
  foreignKey: "usuario_id",
  as: "acoesHistorico",
});

HistoricoPedido.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

// Cliente e atendente do pedido
Usuario.hasMany(Pedido, {
  foreignKey: "cliente_id",
  as: "pedidosComoCliente",
});

Pedido.belongsTo(Usuario, {
  foreignKey: "cliente_id",
  as: "cliente",
});

Usuario.hasMany(Pedido, {
  foreignKey: "atendente_id",
  as: "pedidosAtendidos",
});

Pedido.belongsTo(Usuario, {
  foreignKey: "atendente_id",
  as: "atendente",
});

export {
  Usuario,
  Papel,
  Permissao,
  UsuarioPapel,
  PapelPermissao,
  Pedido,
  HistoricoPedido,
};