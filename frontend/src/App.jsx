import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#faf9fd]">
        <p className="text-slate-400">Loading TaskFlow…</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
