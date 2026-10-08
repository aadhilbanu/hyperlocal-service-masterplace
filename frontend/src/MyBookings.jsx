import { useState, useEffect } from 'react';
import api from './api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await api.get('/bookings/', {
          headers: { Authorization: 'Bearer ' + token },
        });
        setBookings(response.data);
      } catch (err) {
        setError('Could not load your bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const badgeClass = (status) => {
    if (status === 'confirmed') return 'badge badge-confirmed';
    if (status === 'completed') return 'badge badge-completed';
    return 'badge badge-pending';
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ width: 40, height: 4, background: 'var(--amber)', borderRadius: 2, marginBottom: 16 }} />
        <h1 style={{ fontSize: 30 }}>My bookings</h1>
        <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 6 }}>
          Everything you have booked, tracked in one place.
        </p>
      </div>

      {error && <p style={{ color: '#B3261E', fontSize: 14 }}>{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--slate)' }}>
          No bookings yet. Browse services to make your first one.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map((b) => (
          <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 17 }}>{b.listing_title}</h3>
              <p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 4 }}>
                {new Date(b.scheduled_time).toLocaleString()}
              </p>
            </div>
            <span className={badgeClass(b.status)}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
