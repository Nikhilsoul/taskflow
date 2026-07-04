import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-signal-100 bg-white/80 px-6 py-4 backdrop-blur">
      <Link to="/" className="font-display text-xl font-bold text-signal-600">
        TaskFlow
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-500">
              Hi, {user.name}{' '}
              <span className="ml-1 rounded-full bg-signal-50 px-2 py-0.5 text-xs font-medium text-signal-700">
                {user.role}
              </span>
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-signal-600">
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-signal-600">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-signal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-signal-700"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
