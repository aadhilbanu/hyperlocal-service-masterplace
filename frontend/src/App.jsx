import { useState } from 'react';
import Login from './Login';
import Services from './Services';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {loggedIn ? (
        <Services />
      ) : (
        <Login onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;