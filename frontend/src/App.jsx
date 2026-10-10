import { useState, useEffect } from 'react';
import api from './api';
import Login from './Login';
import Register from './Register';
import Services from './Services';
import MyBookings from './MyBookings';
import ProviderListings from './ProviderListings';
import ProviderBookings from './ProviderBookings';

const API_ROOT = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');

const NAV = {
  customer: [['services', 'Browse Services'], ['bookings', 'My Bookings']],
  provider: [['listings', 'My Services'], ['requests', 'Booking Requests']],
  admin: [['admin', 'Admin']],
};

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('access_token')));
  const [screen, setScreen] = useState('login');
  const [view, setView] = useState('');

  const loadUser = async () => {
    try {
      const res = await api.get('/users/me/');
      const links = NAV[res.data.role] || NAV.customer;
      setUser(res.data);
      setView(links[0][0]);
    } catch (err) {
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      loadUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setScreen('login');
  };

  if (checking) {
    return (
      <div className="page">
        <p className="muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (screen === 'register') {
      return <Register onDone={() => setScreen('login')} />;
    }
    return <Login onLoginSuccess={loadUser} onShowRegister={() => setScreen('register')} />;
  }

  const links = NAV[user.role] || NAV.customer;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="topnav">
        <div className="brand">
          <span className="brand-dot" />
          Hyperlocal
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <span className="nav-user">{user.username} ({user.role})</span>
          {links.map((item) => (
            <button
              key={item[0]}
              className={'nav-btn' + (view === item[0] ? ' active' : '')}
              onClick={() => setView(item[0])}
            >
              {item[1]}
            </button>
          ))}
          <button className="nav-btn" style={{ color: 'var(--amber)' }} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      {view === 'services' && <Services />}
      {view === 'bookings' && <MyBookings />}
      {view === 'listings' && <ProviderListings />}
      {view === 'requests' && <ProviderBookings />}
      {view === 'admin' && (
        <div className="page">
          <div className="accent-bar" />
          <h1 style={{ fontSize: 30 }}>Admin</h1>
          <p className="muted" style={{ marginTop: 6, marginBottom: 20 }}>
            Manage categories, users, listings and bookings in the admin panel.
          </p>
          <a className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', borderRadius: 8 }}
             href={API_ROOT + '/admin/'} target="_blank" rel="noreferrer">
            Open admin panel
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
