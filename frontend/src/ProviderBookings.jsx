import { useState, useEffect } from 'react';
import api, { errorText } from './api';

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [bookingRes, reviewRes] = await Promise.all([
        api.get('/bookings/'),
        api.get('/reviews/'),
      ]);
      setBookings(bookingRes.data);
      setReviews(reviewRes.data);
    } catch {
      setError('Could not load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      await api.patch('/bookings/' + id + '/status/', { status: status });
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not update the booking.'));
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="accent-bar" />
        <h1 style={{ fontSize: 30 }}>Booking requests</h1>
        <p className="muted" style={{ marginTop: 6 }}>Confirm requests, then mark the job completed.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="muted">No booking requests yet.</p>
        </div>
      )}

      <div className="stack">
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <div className="row">
              <div>
                <h3 style={{ fontSize: 17 }}>{b.listing_title}</h3>
                <p className="muted">Customer: {b.customer_name}</p>
                <p className="muted">{new Date(b.scheduled_time).toLocaleString()}</p>
              </div>
              <span className={'badge badge-' + b.status}>{b.status}</span>
            </div>
            {b.status === 'pending' && (
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => changeStatus(b.id, 'confirmed')}>Confirm</button>
                <button className="btn-danger" onClick={() => changeStatus(b.id, 'cancelled')}>Decline</button>
              </div>
            )}
            {b.status === 'confirmed' && (
              <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={() => changeStatus(b.id, 'completed')}>Mark completed</button>
                <button className="btn-danger" onClick={() => changeStatus(b.id, 'cancelled')}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {reviews.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: 22, marginBottom: 14 }}>Reviews received</h2>
          <div className="stack">
            {reviews.map((r) => (
              <div key={r.id} className="card">
                <div className="eyebrow">{r.listing_title}</div>
                <p style={{ margin: '4px 0', fontWeight: 600 }}>{r.rating} / 5 by {r.customer_name}</p>
                {r.comment && <p className="muted">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderBookings;
