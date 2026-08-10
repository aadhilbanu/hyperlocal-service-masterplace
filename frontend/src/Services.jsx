import { useState, useEffect } from 'react';
import api from './api';

function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await api.get('/services/listings/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (err) {
      setError('Could not load services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleBook = async (listingId) => {
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const scheduledTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await api.post(
        '/bookings/',
        { listing: listingId, scheduled_time: scheduledTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Booking created successfully!');
    } catch (err) {
      setError('Booking failed. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <h2>Available Services</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {services.length === 0 && !error && <p>No services found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {services.map((s) => (
          <li key={s.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10, borderRadius: 6 }}>
            <strong>{s.title}</strong> — ₹{s.price}
            <br />
            <button onClick={() => handleBook(s.id)} style={{ marginTop: 8 }}>
              Book for tomorrow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Services;