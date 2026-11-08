import { useState, useEffect } from 'react';
import api, { errorText } from './api';

function AdminDashboard({ adminUrl }) {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [statsRes, listRes, catRes] = await Promise.all([
        api.get('/admin/stats/'),
        api.get('/admin/listings/'),
        api.get('/services/categories/'),
      ]);
      setStats(statsRes.data);
      setListings(listRes.data);
      setCategories(catRes.data);
    } catch {
      setError('Could not load the dashboard.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/services/categories/', { name: newCategory });
      setNewCategory('');
      setMessage('Category added.');
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not add the category.'));
    }
  };

  const toggleListing = async (listing) => {
    setError('');
    setMessage('');
    try {
      await api.patch('/admin/listings/' + listing.id + '/', { is_active: !listing.is_active });
      await load();
    } catch (err) {
      setError(errorText(err, 'Could not update the listing.'));
    }
  };

  const totalBookings = stats
    ? stats.bookings.pending + stats.bookings.confirmed + stats.bookings.completed + stats.bookings.cancelled
    : 0;
  const cards = stats
    ? [
        ['Customers', stats.users.customers],
        ['Providers', stats.users.providers],
        ['Active services', stats.listings.active + ' / ' + stats.listings.total],
        ['Bookings', totalBookings],
        ['Pending', stats.bookings.pending],
        ['Completed', stats.bookings.completed],
        ['Avg rating', stats.reviews.average_rating === null ? '-' : stats.reviews.average_rating],
      ]
    : [];

  return (
    <div className="page">
      <div style={{ marginBottom: 28 }}>
        <div className="accent-bar" />
        <h1 style={{ fontSize: 30 }}>Admin dashboard</h1>
        <p className="muted" style={{ marginTop: 6 }}>Platform overview, categories and listing oversight.</p>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <div className="success-box">{message}</div>}

      <div className="stats">
        {cards.map((c) => (
          <div key={c[0]} className="stat-card">
            <div className="stat-num">{c[1]}</div>
            <div className="stat-label">{c[0]}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>Categories</h3>
        <p className="muted" style={{ marginBottom: 12 }}>
          {categories.length === 0 ? 'No categories yet.' : categories.map((c) => c.name).join(', ')}
        </p>
        <form onSubmit={addCategory} style={{ display: 'flex', gap: 10 }}>
          <input type="text" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>

      <h3 style={{ fontSize: 18, marginBottom: 12 }}>All listings</h3>
      <div className="stack">
        {listings.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p className="muted">No listings yet.</p>
          </div>
        )}
        {listings.map((s) => (
          <div key={s.id} className="card">
            <div className="row">
              <div>
                <div className="eyebrow">{s.category ? s.category.name : 'Service'}</div>
                <h3 style={{ fontSize: 17 }}>{s.title}</h3>
                <p className="muted">by {s.provider_name} - Rs. {s.price}</p>
                {!s.is_active && <span className="badge badge-paused" style={{ marginTop: 8 }}>paused</span>}
              </div>
              <button className="btn-secondary" onClick={() => toggleListing(s)}>
                {s.is_active ? 'Pause' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="muted" style={{ marginTop: 28 }}>
        Need full data access?{' '}
        <a href={adminUrl} target="_blank" rel="noreferrer">Open the Django admin panel</a>
      </p>
    </div>
  );
}

export default AdminDashboard;
