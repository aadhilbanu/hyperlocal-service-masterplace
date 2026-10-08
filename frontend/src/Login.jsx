import { useState } from 'react';
import api from './api';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ width: 380, boxShadow: '0 1px 3px rgba(30,42,69,0.06)' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 40, height: 4, background: 'var(--amber)', borderRadius: 2, marginBottom: 16 }} />
          <h1 style={{ fontSize: 28 }}>Welcome back</h1>
          <p style={{ color: 'var(--slate)', fontSize: 14, marginTop: 6 }}>
            Sign in to book trusted local services.
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p style={{ color: '#B3261E', fontSize: 13, marginBottom: 16, marginTop: -8 }}>{error}</p>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 15 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
