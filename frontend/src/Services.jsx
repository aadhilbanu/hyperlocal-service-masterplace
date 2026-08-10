import { useState, useEffect } from 'react';
import api from './api';

function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchServices();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '50px auto' }}>
      <h2>Available Services</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {services.length === 0 && !error && <p>No services found (add some via Django admin).</p>}
      <ul>
        {services.map((s) => (
          <li key={s.id}>{s.title} — ₹{s.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Services;