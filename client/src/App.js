import React, { useState, useEffect } from 'react';
import './App.css';
import TokenGenerator from './components/TokenGenerator';
import ChatApp from './components/ChatApp';

function App() {
  const [token, setToken] = useState(localStorage.getItem('lockin-token'));
  const [user, setUser] = useState(localStorage.getItem('lockin-user'));

  const handleTokenGenerated = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('lockin-token', newToken);
    localStorage.setItem('lockin-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lockin-token');
    localStorage.removeItem('lockin-user');
  };

  return (
    <div className="app">
      {!token ? (
        <TokenGenerator onTokenGenerated={handleTokenGenerated} />
      ) : (
        <ChatApp 
          token={token} 
          user={JSON.parse(user)} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
