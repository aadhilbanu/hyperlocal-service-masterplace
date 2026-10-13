import { useState, useEffect } from 'react';
import api, { errorText } from './api';

function minDateTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function ratingText(service) {
  if (service.average_rating === null || service.average_rating === undefined) {
    return 'No reviews yet';
  }
  return 'Rating ' + service.average_rating + ' / 5 (' + service.review_count + ' reviews)';
}

function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openId, setOpenId] = useState(null);
  const [when, setWhen] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/services/listings/'), api.get('/services/categories/')])
      .then(([listRes, catRes]) => {
        setServices(listRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError('Could not load services right now.'))
      .finally(() => setLoading(false));
  }, []);

  const visible = services.filter((s) => {
    const text = (s.title + ' ' + s.description + ' ' + s.provider_name).toLowerCase();
    const matchesText = text.includes(search.toLowerCase());
    const matchesCategory = !categoryId || (s.category && String(s.category.id) === categoryId);
    return matchesText && matchesCategory;
  });

  const handleBook = async (listingId) => {
    setError('');
    setMessage('');
    if (!when) {
      setError('Please choose a date and time.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/bookings/', {
        listing: listingId,
        scheduled_time: new Date(when).toISOString(),
      });
      setMessage('Booking requested. Track it under My Bookings.');
      setOpenId(null);
      setWhen('');
    } catch (err) {
      setError(errorText(err, 'Booking did not go through. Try again.'));
    } finally {
      setSaving(false);
    }
  };

  const toggle = (id) => {
    setError('');
    setMessage('');
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="accent-bar" />
        <h1 style={{ fontSize: 30 }}>Available services</h1>
        <p className="muted" style={{ marginTop: 6 }}>Verified providers near you, ready to book.</p>
      </div>

      <div className="toolbar">
        <input type="text" placeholder="Search services or providers" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <div className="success-box">{message}</div>}

      {!loading && services.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="muted">No services listed yet. Check back soon.</p>
        </div>
      )}
      {!loading && services.length > 0 && visible.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="muted">Nothing matches your search.</p>
        </div>
      )}

      <div className="stack">
        {visible.map((s) => (
          <div key={s.id} className="card">
            <div className="row">
              <div>
                <div className="eyebrow">{s.category ? s.category.name : 'Service'}</div>
                <h3 style={{ fontSize: 18 }}>{s.title}</h3>
                <p className="muted">by {s.provider_name}</p>
                <p className="muted">{ratingText(s)}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="price">Rs. {s.price}</div>
                <button className="btn-primary" onClick={() => toggle(s.id)}>
                  {openId === s.id ? 'Close' : 'Book'}
                </button>
              </div>
            </div>
            {openId === s.id && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <label className="label">Choose date and time</label>
                <input type="datetime-local" min={minDateTime()} value={when} onChange={(e) => setWhen(e.target.value)} />
                <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => handleBook(s.id)} disabled={saving}>
                  {saving ? 'Booking...' : 'Confirm booking'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
