export default function ReservationForm({ user, reservationDate, setReservationDate, people, setPeople, onSubmit }) {
  return (
    <section id="reservas" className="panel">
      <p className="eyebrow">PLANEJE SUA VISITA</p>
      <h2>Faça sua reserva</h2>
      {user ? (
        <form className="inline-form" onSubmit={onSubmit}>
          <label>Data e horário
            <input type="datetime-local" value={reservationDate} onChange={e => setReservationDate(e.target.value)} required />
          </label>
          <label>Pessoas
            <input type="number" min="1" max="30" value={people} onChange={e => setPeople(e.target.value)} />
          </label>
          <button>Solicitar reserva</button>
        </form>
      ) : <p>Entre na sua conta para solicitar uma reserva.</p>}
    </section>
  );
}
