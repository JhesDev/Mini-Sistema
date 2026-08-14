import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/auth';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';

const TEST_USERS = [
  { label: 'Admin', username: 'admin', pass: 'admin123', role: 'ADMIN', badge: 'badge--purple' },
  { label: 'Operador', username: 'operador', pass: 'operador123', role: 'OPERADOR', badge: 'badge--blue' },
  { label: 'Supervisor', username: 'supervisor', pass: 'supervisor123', role: 'SUPERVISOR', badge: 'badge--green' },
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
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-icon">📋</div>
          <h1 className="login-title">Gestión de Trámites</h1>
          <p className="login-subtitle">Inicia sesión con tus credenciales de acceso</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="form login-form">
          <div className="form-field">
            <label htmlFor="username">Usuario o Correo</label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, operador o correo..."
              autoComplete="username"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
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
            className="login-submit-btn"
          >
            Ingresar al Sistema
          </Button>
        </form>

        <div className="login-demo-section">
          <span className="login-demo-title">Acceso rápido para pruebas:</span>
          <div className="login-demo-grid">
            {TEST_USERS.map((item) => (
              <button
                key={item.username}
                type="button"
                className="login-demo-chip"
                onClick={() => handleQuickFill(item)}
                disabled={isSubmitting}
              >
                <span className={`badge ${item.badge}`}>{item.role}</span>
                <span className="login-demo-user">{item.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
