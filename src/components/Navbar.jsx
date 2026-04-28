import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, LogIn, Users } from 'lucide-react';

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const adminToken  = sessionStorage.getItem('adminToken');
  const publicToken = sessionStorage.getItem('publicToken');

  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handlePublicLogout = () => {
    sessionStorage.removeItem('publicToken');
    navigate('/public-login');
  };

  const hideNav =
    location.pathname === '/public-login' ||
    location.pathname === '/login';

  return (

      <nav className="navbar">
        {/* Brand */}
        <Link to="/" className="brand-link">
          <img
            src="/tn-logo.png"
            alt="Smart Civic Logo"
            className="brand-logo"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="brand-text">
            SmartCivic
          </span>
        </Link>

        {/* Actions */}
        {!hideNav && (
          <div className="nav-actions">
            {adminToken ? (
              <>
                <Link to="/admin" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button onClick={handleAdminLogout} className="btn btn-danger" style={{ gap: '0.4rem' }}>
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : publicToken ? (
              <>
                <span style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                  <Users size={14} color="var(--success)" />
                  Community Member
                </span>
                <button onClick={handlePublicLogout} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/public-login" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <LogIn size={15} />
                Community Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
