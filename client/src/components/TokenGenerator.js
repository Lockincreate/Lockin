import React, { useState } from 'react';
import axios from 'axios';
import './TokenGenerator.css';

function TokenGenerator({ onTokenGenerated }) {
  const [mode, setMode] = useState('auto'); // auto or manual
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateAutoToken = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/token/generate');
      onTokenGenerated(response.data.token, {
        userId: response.data.userId,
        username: response.data.username
      });
    } catch (err) {
      setError('Failed to generate token. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateManualToken = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/token/manual', { username });
      onTokenGenerated(response.data.token, {
        userId: response.data.userId,
        username: response.data.username
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate token');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-container">
      <div className="token-card">
        <div className="token-header">
          <img src="/logo.svg" alt="Lockin Logo" className="logo" />
          <h1>Lockin</h1>
          <p>Lightweight Calling & Messaging</p>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'auto' ? 'active' : ''}`}
            onClick={() => setMode('auto')}
          >
            ⚡ Quick Start
          </button>
          <button
            className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
            onClick={() => setMode('manual')}
          >
            ✍️ Custom Name
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {mode === 'auto' ? (
          <div className="auto-mode">
            <p>Get instant access with an auto-generated ID</p>
            <button
              className="btn btn-primary"
              onClick={generateAutoToken}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Start Now'}
            </button>
          </div>
        ) : (
          <div className="manual-mode">
            <input
              type="text"
              placeholder="Enter your name (min 3 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={generateManualToken}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create Account'}
            </button>
          </div>
        )}

        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>✅ Free Forever</li>
            <li>🔊 Voice & Video Calls</li>
            <li>💬 Instant Messaging</li>
            <li>🌐 Works on Any Device</li>
            <li>⚡ Lightning Fast</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TokenGenerator;
