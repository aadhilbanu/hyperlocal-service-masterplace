import { useState } from 'react';
import api from './api';

function Login({ onLoginSuccess, onShowRegister }) {
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
      <div className="card" style={{ width: 380 }}>
        <div style={{ marginBottom: 28 }}>
          <div className="accent-bar" />
          <h1 style={{ fontSize: 28 }}>Welcome back</h1>
          <p className="muted" style={{ marginTop: 6 }}>Sign in to book trusted local services.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 15 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {onShowRegister && (
          <p className="muted" style={{ marginTop: 18, textAlign: 'center' }}>
            New here?{' '}
            <button type="button" className="btn-ghost" onClick={onShowRegister}>Create an account</button>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
