import { useState } from 'react';
import Login from './Login';
import Services from './Services';
import MyBookings from './MyBookings';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState('services');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLoginSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ background: 'var(--navy)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
          <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>
            Hyperlocal
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setView('services')}
            style={{
              background: view === 'services' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: '#fff',
              padding: '8px 16px',
              fontSize: 14,
            }}
          >
            Browse Services
          </button>
          <button
            onClick={() => setView('bookings')}
            style={{
              background: view === 'bookings' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: '#fff',
              padding: '8px 16px',
              fontSize: 14,
            }}
          >
            My Bookings
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: 'var(--amber)',
              padding: '8px 16px',
              fontSize: 14,
            }}
          >
            Log Out
          </button>
        </div>
      </nav>
      {view === 'services' ? <Services /> : <MyBookings />}
    </div>
  );
}

export default App;
