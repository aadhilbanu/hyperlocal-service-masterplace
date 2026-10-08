import { useState, useEffect } from 'react';
import api from './api';

function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.get('/services/listings/', {
        headers: { Authorization: 'Bearer ' + token },
      });
      setServices(response.data);
    } catch (err) {
      setError('Could not load services right now.');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleBook = async (listingId) => {
    setMessage('');
    setError('');
    setBookingId(listingId);
    try {
      const token = localStorage.getItem('access_token');
      const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await api.post(
        '/bookings/',
        { listing: listingId, scheduled_time: scheduledTime },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setMessage('Booked. See it under My Bookings.');
    } catch (err) {
      setError('Booking did not go through. Try again.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ width: 40, height: 4, background: 'var(--amber)', borderRadius: 2, marginBottom: 16 }} />
        <h1 style={{ fontSize: 30 }}>Available services</h1>
        <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 6 }}>
          Verified providers near you, ready to book.
        </p>
      </div>

      {error && <p style={{ color: '#B3261E', fontSize: 14, marginBottom: 16 }}>{error}</p>}
      {message && (
        <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '10px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
          {message}
        </div>
      )}

      {services.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--slate)' }}>
          No services listed yet. Check back soon.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {services.map((s) => (
          <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber-dark)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                {s.category ? s.category.name : 'Service'}
              </div>
              <h3 style={{ fontSize: 18 }}>{s.title}</h3>
              <p style={{ color: 'var(--slate)', fontSize: 13, marginTop: 4 }}>
                by {s.provider_name}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>
                Rs. {s.price}
              </div>
              <button
                onClick={() => handleBook(s.id)}
                className="btn-primary"
                disabled={bookingId === s.id}
              >
                {bookingId === s.id ? 'Booking...' : 'Book for tomorrow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
