import { useState } from 'react';
import { useAppContext } from './context/AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserView from './pages/UserView';
import AdminView from './pages/AdminView';

function App() {
  const { isAuthenticated, userMode } = useAppContext();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onLogin={() => setShowRegister(false)} />;
    }
    return <Login onRegister={() => setShowRegister(true)} />;
  }

  if (userMode === 'admin') {
    return <AdminView />;
  }

  return <UserView />;
}

export default App;
