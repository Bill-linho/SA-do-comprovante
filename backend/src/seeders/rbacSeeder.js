import {
  Papel,
  Permissao,
  PapelPermissao,
  Usuario,
  UsuarioPapel,
} from "../models/index.js";

const papeis = [
  ["cliente", "Realiza e consulta os próprios pedidos"],
  ["atendente", "Registra e acompanha pedidos"],
  ["cozinheiro", "Prepara os pedidos"],
  ["gerente", "Gerencia pedidos e operações do restaurante"],
  ["admin", "Acesso administrativo do sistema"],
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
  ["pagamento.simular", "Simular pagamentos no ambiente de desenvolvimento"],
  ["comprovante.visualizar", "Visualizar e imprimir comprovantes"],
];

const permissoesPorPapel = {
  cliente: [
    "pedido.criar",
    "pedido.visualizar_proprio",
    "pagamento.simular",
    "comprovante.visualizar",
  ],

  atendente: [
    "pedido.criar",
    "pedido.visualizar_todos",
    "pedido.atualizar",
    "pedido.cancelar",
    "historico.visualizar",
    "pagamento.simular",
    "comprovante.visualizar",
  ],

  cozinheiro: [
    "cozinha.visualizar",
    "cozinha.atualizar_status",
  ],

  gerente: [
    "pedido.visualizar_todos",
    "pedido.atualizar",
    "pedido.cancelar",
    "cozinha.visualizar",
    "cozinha.atualizar_status",
    "historico.visualizar",
    "produto.gerenciar",
    "usuario.gerenciar",
    "impressao.gerenciar",
    "pagamento.simular",
    "comprovante.visualizar",
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

  // Contas antigas sem papel recebem o papel básico de cliente.
  const usuarios = await Usuario.findAll({ attributes: ["id"] });
  for (const usuario of usuarios) {
    const vinculo = await UsuarioPapel.findOne({
      where: { usuario_id: usuario.id },
    });

    if (!vinculo) {
      await UsuarioPapel.create({
        usuario_id: usuario.id,
        papel_id: papeisCriados.cliente.id,
      });
    }
  }

  console.log("Papéis, permissões e papéis padrão configurados!");
}