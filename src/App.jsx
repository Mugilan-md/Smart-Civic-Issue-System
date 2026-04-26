import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicForm from './pages/PublicForm';
import PublicLogin from './pages/PublicLogin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Guard: requires public community token
function RequirePublicAuth({ children }) {
  const token = sessionStorage.getItem('publicToken');
  return token ? children : <Navigate to="/public-login" replace />;
}

// Guard: requires admin token
function RequireAdminAuth({ children }) {
  const token = sessionStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-wrapper container">
        <Routes>
          {/* Public report form — requires community login */}
          <Route
            path="/"
            element={
              <RequirePublicAuth>
                <PublicForm />
              </RequirePublicAuth>
            }
          />

          {/* Community login */}
          <Route path="/public-login" element={<PublicLogin />} />

          {/* Admin login */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Admin dashboard — requires admin login */}
          <Route
            path="/admin"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
