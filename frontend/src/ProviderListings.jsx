import { useState, useEffect } from 'react';
import api, { errorText } from './api';

function ratingText(service) {
  if (service.average_rating === null || service.average_rating === undefined) {
    return 'No reviews yet';
  }
  return 'Rating ' + service.average_rating + ' / 5 (' + service.review_count + ' reviews)';
}

function ProviderListings() {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [listRes, catRes] = await Promise.all([
        api.get('/services/listings/', { params: { mine: 'true' } }),
        api.get('/services/categories/'),
      ]);
      setListings(listRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setForm((f) => (f.category_id ? f : { ...f, category_id: String(catRes.data[0].id) }));
      }
    } catch {
      setError('Could not load your services.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api.post('/services/listings/', {
        title: form.title,
        description: form.description,
        price: form.price,
        category_id: Number(form.category_id),
      });
      setMessage('Service published. Customers can book it now.');
      setForm({ ...form, title: '', description: '', price: '' });
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not publish the service.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (listing) => {
    setError('');
    setMessage('');
    try {
      await api.patch('/services/listings/' + listing.id + '/', { is_active: !listing.is_active });
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not update the service.'));
    }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="accent-bar" />
        <h1 style={{ fontSize: 30 }}>My services</h1>
        <p className="muted" style={{ marginTop: 6 }}>Publish what you offer and track how it is rated.</p>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <div className="success-box">{message}</div>}

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 14 }}>Add a service</h3>
        {categories.length === 0 ? (
          <p className="muted">No categories exist yet. An admin needs to add one in the admin panel first.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Title</label>
              <input type="text" value={form.title} onChange={update('title')} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Category</label>
              <select value={form.category_id} onChange={update('category_id')}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Price (Rs.)</label>
              <input type="number" min="1" step="0.01" value={form.price} onChange={update('price')} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Description</label>
              <textarea rows="3" value={form.description} onChange={update('description')} required />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Publishing...' : 'Publish service'}
            </button>
          </form>
        )}
      </div>

      <div className="stack">
        {listings.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p className="muted">You have not published any services yet.</p>
          </div>
        )}
        {listings.map((s) => (
          <div key={s.id} className="card">
            <div className="row">
              <div>
                <div className="eyebrow">{s.category ? s.category.name : 'Service'}</div>
                <h3 style={{ fontSize: 18 }}>{s.title}</h3>
                <p className="muted">{ratingText(s)}</p>
                {!s.is_active && <span className="badge badge-paused" style={{ marginTop: 8 }}>paused</span>}
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="price">Rs. {s.price}</div>
                <button className="btn-secondary" onClick={() => toggleActive(s)}>
                  {s.is_active ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProviderListings;
