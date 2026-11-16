import { useCallback, useState } from 'react';
import { reservationService } from '../services/reservationService';

export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const refreshReservations = useCallback(async () => {
    setLoading(true);
    try { setReservations(await reservationService.list()); }
    finally { setLoading(false); }
  }, []);
  const createReservation = async (data) => {
    const result = await reservationService.create(data);
    await refreshReservations();
    return result;
  };
  return { reservations, loading, refreshReservations, createReservation };
}
