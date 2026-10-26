import {
  Papel,
  Permissao,
  PapelPermissao,
} from "../models/index.js";

const papeis = [
  ["cliente", "Realiza e consulta os próprios pedidos"],
  ["atendente", "Registra e acompanha pedidos"],
  ["cozinheiro", "Prepara os pedidos"],
  ["admin", "Administra o sistema"],
];

const permissoes = [
  ["pedido.criar", "Criar pedidos"],
  ["pedido.visualizar_proprio", "Consultar os próprios pedidos"],
  ["pedido.visualizar_todos", "Consultar todos os pedidos"],
  ["pedido.atualizar", "Atualizar pedidos"],
  ["pedido.cancelar", "Cancelar pedidos"],
  ["cozinha.visualizar", "Visualizar pedidos da cozinha"],
  ["cozinha.atualizar_status", "Atualizar preparação"],
  ["historico.visualizar", "Consultar histórico de pedidos"],
  ["produto.gerenciar", "Gerenciar produtos"],
  ["usuario.gerenciar", "Gerenciar usuários e papéis"],
  ["impressao.gerenciar", "Gerenciar impressões"],
];

const permissoesPorPapel = {
  cliente: [
    "pedido.criar",
    "pedido.visualizar_proprio",
  ],

  atendente: [
    "pedido.criar",
    "pedido.visualizar_todos",
    "pedido.atualizar",
    "pedido.cancelar",
    "historico.visualizar",
  ],

  cozinheiro: [
    "cozinha.visualizar",
    "cozinha.atualizar_status",
  ],

  admin: permissoes.map(([nome]) => nome),
};

export async function executarRbacSeeder() {
  const papeisCriados = {};

  for (const [nome, descricao] of papeis) {
    const [papel] = await Papel.findOrCreate({
      where: { nome },
      defaults: { nome, descricao },
    });

    papeisCriados[nome] = papel;
  }

  const permissoesCriadas = {};

  for (const [nome, descricao] of permissoes) {
    const [permissao] = await Permissao.findOrCreate({
      where: { nome },
      defaults: { nome, descricao },
    });

    permissoesCriadas[nome] = permissao;
  }

  for (const [nomePapel, nomesPermissoes] of Object.entries(
    permissoesPorPapel
  )) {
    const papel = papeisCriados[nomePapel];

    for (const nomePermissao of nomesPermissoes) {
      await PapelPermissao.findOrCreate({
        where: {
          papel_id: papel.id,
          permissao_id: permissoesCriadas[nomePermissao].id,
        },
        defaults: {
          papel_id: papel.id,
          permissao_id: permissoesCriadas[nomePermissao].id,
        },
      });
    }
  }

  console.log("Papéis e permissões configurados!");
}