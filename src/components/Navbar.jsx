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
    <>
      {/* Google Fonts: Poppins (modern/clean) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');

        .navbar {
          background: #000000 !important; /* Force black background */
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .brand-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 1.75rem;
          letter-spacing: -0.01em;
          line-height: 1;
          text-decoration: none;
          display: inline-block;
          /* Sharper Indian Tricolour Gradient */
          background: linear-gradient(to bottom, #FF9933 30%, #ffffff 30%, #ffffff 70%, #138808 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 2px rgba(255,255,255,0.1));
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
        }
        .brand-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
          flex-shrink: 0;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: white; /* Keep logo readable */
          border-radius: 50%;
          padding: 2px;
        }
        .brand-link:hover .brand-logo {
          transform: scale(1.1);
        }

        /* Adjust other nav elements for dark background */
        .btn-secondary {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.2) !important;
        }
        .nav-actions span {
          color: rgba(255,255,255,0.7) !important;
        }
      `}</style>

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
