import { useState, useEffect } from 'react';
import api from './api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/bookings/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data);
      } catch (err) {
        setError('Could not load bookings');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <h2>My Bookings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookings.length === 0 && !error && <p>No bookings yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {bookings.map((b) => (
          <li key={b.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 6 }}>
            <strong>{b.listing_title}</strong>
            <br />
            Status: <span style={{ textTransform: 'capitalize' }}>{b.status}</span>
            <br />
            Scheduled: {new Date(b.scheduled_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
