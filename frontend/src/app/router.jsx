import { Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { BandejaTramites, TramiteDetalle } from '@/modules/tramite';
import { ListaClientes } from '@/modules/cliente';
import { LoginView } from '@/modules/auth';
import { ProtectedRoute, useAuth } from '@/shared/auth';
import { Badge } from '@/shared/components/Badge';

function Layout() {
  const { user, logout } = useAuth();

  const roleColor = {
    ADMIN: 'purple',
    OPERADOR: 'blue',
    SUPERVISOR: 'green',
  }[user?.rol] ?? 'gray';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Gestión de Trámites
            </div>

            <div className="flex items-center gap-1.5">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Bandeja
              </NavLink>
              <NavLink
                to="/clientes"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Clientes
              </NavLink>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3.5 ml-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                  {user.nombre_completo || user.username}
                </span>
                <Badge color={roleColor}>{user.rol}</Badge>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-white/10 hover:bg-red-600 active:bg-red-700 text-white text-xs font-medium px-3 py-1.5 transition-colors border border-white/15 cursor-pointer"
                title="Cerrar sesión"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
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
