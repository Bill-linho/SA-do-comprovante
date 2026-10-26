export default function ReservaList({ reservas, onStatusChange, onCancelar }) {
  if (!reservas.length) {
    return <p>Nenhuma reserva encontrada.</p>;
  }

  return (
    <div>
      <h2>Reservas</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Pessoas</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.nome}</td>
              <td>{new Date(`${reserva.data_reserva}T00:00:00`).toLocaleDateString('pt-BR')}</td>
              <td>{String(reserva.horario).slice(0, 5)}</td>
              <td>{reserva.quantidade_pessoas}</td>
              <td>{reserva.status}</td>
              <td>
                {reserva.status !== 'cancelada' && (
                  <>
                    <button onClick={() => onStatusChange(reserva.id, 'confirmada')}>
                      Confirmar
                    </button>
                    <button onClick={() => onCancelar(reserva.id)}>
                      Cancelar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}