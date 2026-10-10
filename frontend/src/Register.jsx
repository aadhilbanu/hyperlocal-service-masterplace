import { useState } from 'react';
import api, { errorText } from './api';

function Register({ onDone }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'customer', phone_number: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/users/register/', form);
      setDone(true);
    } catch (err) {
      setError(errorText(err, 'Could not create the account.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: 400 }}>
        <div style={{ marginBottom: 24 }}>
          <div className="accent-bar" />
          <h1 style={{ fontSize: 28 }}>Create account</h1>
          <p className="muted">Book services, or offer your own.</p>
        </div>
        {done ? (
          <div>
            <div className="success-box">Account created. You can sign in now.</div>
            <button className="btn-primary" style={{ width: '100%', padding: '12px 0' }} onClick={onDone}>
              Go to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="label">I want to</label>
              <select value={form.role} onChange={update('role')}>
                <option value="customer">Book services</option>
                <option value="provider">Offer services</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Username</label>
              <input type="text" value={form.username} onChange={update('username')} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={update('email')} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="label">Phone (optional)</label>
              <input type="text" value={form.phone_number} onChange={update('phone_number')} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Password (min 6 characters)</label>
              <input type="password" value={form.password} onChange={update('password')} required />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 15 }} disabled={saving}>
              {saving ? 'Creating...' : 'Create account'}
            </button>
            <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
              Already registered?{' '}
              <button type="button" className="btn-ghost" onClick={onDone}>Sign in</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
