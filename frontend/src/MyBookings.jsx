import { useState, useEffect } from 'react';
import api, { errorText } from './api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const load = async () => {
    try {
      const [bookingRes, reviewRes] = await Promise.all([
        api.get('/bookings/'),
        api.get('/reviews/'),
      ]);
      setBookings(bookingRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      setError('Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reviewedIds = reviews.map((r) => r.booking);

  const changeStatus = async (id, status) => {
    setError('');
    try {
      await api.patch('/bookings/' + id + '/status/', { status: status });
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not update the booking.'));
    }
  };

  const submitReview = async (bookingId) => {
    setError('');
    try {
      await api.post('/reviews/', { booking: bookingId, rating: Number(rating), comment: comment });
      setReviewingId(null);
      setRating('5');
      setComment('');
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not save your review.'));
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="accent-bar" />
        <h1 style={{ fontSize: 30 }}>My bookings</h1>
        <p className="muted" style={{ marginTop: 6 }}>Everything you have booked, tracked in one place.</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {!loading && bookings.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="muted">No bookings yet. Browse services to make your first one.</p>
        </div>
      )}

      <div className="stack">
        {bookings.map((b) => {
          const canCancel = b.status === 'pending' || b.status === 'confirmed';
          const canReview = b.status === 'completed' && !reviewedIds.includes(b.id);
          return (
            <div key={b.id} className="card">
              <div className="row">
                <div>
                  <h3 style={{ fontSize: 17 }}>{b.listing_title}</h3>
                  <p className="muted">{new Date(b.scheduled_time).toLocaleString()}</p>
                </div>
                <span className={'badge badge-' + b.status}>{b.status}</span>
              </div>
              {(canCancel || canReview) && (
                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                  {canCancel && (
                    <button className="btn-danger" onClick={() => changeStatus(b.id, 'cancelled')}>Cancel booking</button>
                  )}
                  {canReview && (
                    <button className="btn-secondary" onClick={() => setReviewingId(reviewingId === b.id ? null : b.id)}>
                      {reviewingId === b.id ? 'Close' : 'Leave a review'}
                    </button>
                  )}
                </div>
              )}
              {reviewingId === b.id && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                  <label className="label">Rating</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Okay</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Bad</option>
                  </select>
                  <label className="label" style={{ marginTop: 12 }}>Comment (optional)</label>
                  <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
                  <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => submitReview(b.id)}>
                    Submit review
                  </button>
                </div>
              )}
              {b.status === 'completed' && reviewedIds.includes(b.id) && (
                <p className="muted" style={{ marginTop: 12 }}>Thanks, your review is saved.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookings;
