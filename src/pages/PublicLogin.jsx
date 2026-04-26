import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from 'lucide-react';

function PublicLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/public-login`, credentials);
      sessionStorage.setItem('publicToken', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid community credentials. Please try again.');
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
      <div className="card animate-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>

        {/* Header */}
        <div className="text-center mb-6">
          {/* Icon */}
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
          }}>
            <Users size={30} color="white" />
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>Community Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to report civic issues in your area
          </p>
        </div>

        {/* Community badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(135deg, #ecfdf5, #eff6ff)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          fontSize: '0.8125rem',
          color: '#065f46'
        }}>
          <Shield size={15} color="#10b981" style={{ flexShrink: 0 }} />
          <span>Access restricted to registered community members only</span>
        </div>

        {/* Error */}
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
                <User size={13} /> Community Username
              </span>
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter community username"
              autoComplete="username"
              autoFocus
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
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-lg w-full"
            style={{
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              color: 'white',
              boxShadow: '0 2px 12px rgba(16,185,129,0.35)',
              border: 'none'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              <>
                Access Community Portal
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <hr className="divider" />

        {/* Admin hint */}
        <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Are you an admin?{' '}
          <a
            href="/login"
            style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
          >
            Admin Login →
          </a>
        </div>
      </div>
    </div>
  );
}

export default PublicLogin;
