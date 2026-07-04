import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('That email and password combination did not match.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl shadow-signal-100">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-500">Log in to see your tasks.</p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
        <input
          type="email"
          required
          className="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-100"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="mb-1 block text-sm font-medium text-slate-600">Password</label>
        <input
          type="password"
          required
          className="mb-6 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-100"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={busy}
          className="w-full rounded-lg bg-signal-600 py-2.5 font-medium text-white transition hover:bg-signal-700 disabled:opacity-60"
        >
          {busy ? 'Logging in…' : 'Log in'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{' '}
          <Link to="/register" className="font-medium text-signal-600">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
