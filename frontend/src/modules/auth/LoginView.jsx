import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/auth';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Alert } from '@/shared/components/Alert';

const TEST_USERS = [
  { label: 'Admin', username: 'admin', pass: 'admin123', role: 'ADMIN', color: 'purple' },
  { label: 'Operador', username: 'operador', pass: 'operador123', role: 'OPERADOR', color: 'blue' },
  { label: 'Supervisor', username: 'supervisor', pass: 'supervisor123', role: 'SUPERVISOR', color: 'green' },
];

export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (user) => {
    setUsername(user.username);
    setPassword(user.pass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200/80">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-2xl shadow-xs">
            📋
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Trámites</h1>
          <p className="text-sm text-slate-500 mt-1">Inicia sesión con tus credenciales de acceso</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Usuario o Correo
            </label>
            <input
              id="username"
              type="text"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs transition-colors"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, operador o correo..."
              autoComplete="username"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full py-2.5 text-base font-semibold shadow-md mt-2"
          >
            Ingresar al Sistema
          </Button>
        </form>

        <div className="border-t border-slate-200 pt-6 mt-6">
          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
            Acceso rápido para pruebas
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {TEST_USERS.map((item) => (
              <button
                key={item.username}
                type="button"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 transition-all cursor-pointer text-center group"
                onClick={() => handleQuickFill(item)}
                disabled={isSubmitting}
              >
                <Badge color={item.color}>{item.role}</Badge>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                  {item.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
