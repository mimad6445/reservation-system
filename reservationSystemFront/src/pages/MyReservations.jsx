import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    API.get('/reservations/mine').then((res) => setReservations(res.data));
  }, []);

  return (
    <div>
      <h2>My Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r._id}>
            {r.product?.name || 'Unknown product'} - {r.status} on {new Date(r.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}