import { useState } from 'react';
import ReservationForm from '../components/ReservationForm';
import { useAuth } from '../contexts/AuthContext';
import { useReservations } from '../hooks/useReservations';

export default function ReservationsPage({ showNotice }) {
  const { user } = useAuth();
  const { createReservation } = useReservations();
  const [reservationDate, setReservationDate] = useState('');
  const [people, setPeople] = useState('2');

  async function submit(event) {
    event.preventDefault();
    if (!user) return showNotice('Entre na sua conta para solicitar uma reserva.');
    try {
      await createReservation({ dateTime: new Date(reservationDate).toISOString(), people: Number(people) });
      setReservationDate('');
      showNotice('Reserva solicitada com sucesso.');
    } catch (error) { showNotice(error.message); }
  }

  return <ReservationForm user={user} reservationDate={reservationDate}
    setReservationDate={setReservationDate} people={people} setPeople={setPeople} onSubmit={submit} />;
}
