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
    <div>
      <nav style={{ textAlign: 'center', padding: 16, borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setView('services')} style={{ marginRight: 10 }}>
          Browse Services
        </button>
        <button onClick={() => setView('bookings')} style={{ marginRight: 10 }}>
          My Bookings
        </button>
        <button onClick={handleLogout}>Log Out</button>
      </nav>
      {view === 'services' ? <Services /> : <MyBookings />}
    </div>
  );
}

export default App;