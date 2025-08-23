import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Upload from './pages/Upload';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Style function for nav links
  const navLinkStyle = (path) => ({
    padding: '10px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'block',
    marginBottom: '6px',
    background: location.pathname === path ? '#1e293b' : 'transparent',
    color: 'white',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: '#0f172a',
          color: 'white',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // keeps logout at bottom
          height: '100vh', // ensures full height
          boxSizing: 'border-box',
          position: 'fixed', // fixed sidebar
          top: 0,
          left: 0,
        }}
      >
        <div>
          <h2
            style={{
              marginTop: 0,
              marginBottom: 24,
              fontSize: 20,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            ⚡ Dashboard
          </h2>

          {/* Navigation */}
          <nav style={{ display: 'grid', gap: 8 }}>
            <Link to="/" style={navLinkStyle('/')}>🏠 Home</Link>
            {user.role === 'admin' && (
              <Link to="/agents" style={navLinkStyle('/agents')}>👥 Agents</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/upload" style={navLinkStyle('/upload')}>📂 Upload & Distribute</Link>
            )}
          </nav>
        </div>

        {/* Logout button */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 0,
              padding: '12px 14px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500,
              width: '100%',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#dc2626')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ef4444')}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          background: '#f8fafc',
          marginLeft: 240, // offset for fixed sidebar
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}
