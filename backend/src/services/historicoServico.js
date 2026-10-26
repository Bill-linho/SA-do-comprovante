import { HistoricoPedido } from "../models/index.js";

export async function registrarHistorico({
  pedidoId,
  usuarioId,
  acao,
  statusAnterior = null,
  statusNovo = null,
  detalhes = null,
  transaction,
}) {
  return HistoricoPedido.create(
    {
      pedido_id: pedidoId,
      usuario_id: usuarioId ?? null,
      acao,
      status_anterior: statusAnterior,
      status_novo: statusNovo,
      detalhes,
    },
    { transaction }
  );
}