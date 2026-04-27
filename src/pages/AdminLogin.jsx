import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User, Eye, EyeOff, Shield, ArrowRight, AlertCircle } from 'lucide-react';

function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await axios.post(`${apiUrl}/api/login`, credentials);
      sessionStorage.setItem('adminToken', response.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem 1rem'
    }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>

        {/* Header */}
        <div className="text-center mb-6">
          <div style={{
            width: 60, height: 60,
            background: 'var(--gradient)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
          }}>
            <Shield size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to access the SPIRS Dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} /> Username
              </span>
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Lock size={13} /> Password
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-control"
                required
                placeholder="••••••••••"
                autoComplete="current-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.875rem',
          background: 'var(--bg-page)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          🔒 Authorized personnel only
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
