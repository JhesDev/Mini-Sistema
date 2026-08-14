import { Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { BandejaTramites, TramiteDetalle } from '@/modules/tramite';
import { ListaClientes } from '@/modules/cliente';
import { LoginView } from '@/modules/auth';
import { ProtectedRoute, useAuth } from '@/shared/auth';

function Layout() {
  const { user, logout } = useAuth();

  const roleBadgeClass = {
    ADMIN: 'badge--purple',
    OPERADOR: 'badge--blue',
    SUPERVISOR: 'badge--green',
  }[user?.rol] ?? 'badge--gray';

  return (
    <>
      <nav className="nav">
        <div className="nav__brand">
          <span>Gestión de Trámites</span>
        </div>

        <div className="nav__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav__link nav__link--active' : 'nav__link'
            }
          >
            Bandeja
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              isActive ? 'nav__link nav__link--active' : 'nav__link'
            }
          >
            Clientes
          </NavLink>
        </div>

        {user && (
          <div className="nav__user">
            <div className="nav__user-info">
              <span className="nav__user-name">{user.nombre_completo || user.username}</span>
              <span className={`badge ${roleBadgeClass}`}>{user.rol}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn btn--secondary btn--sm nav__logout-btn"
              title="Cerrar sesión"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginView />} />

      {/* Rutas protegidas */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<BandejaTramites />} />
        <Route path="/tramites/:id" element={<TramiteDetalle />} />
        <Route path="/clientes" element={<ListaClientes />} />
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
