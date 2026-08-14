import { Routes, Route, NavLink } from 'react-router-dom';
import { BandejaTramites, TramiteDetalle } from '@/modules/tramite';
import { ListaClientes } from '@/modules/cliente';

export function AppRouter() {
  return (
    <>
      <nav className="nav">
        <div className="nav__brand">Gestión de Trámites</div>
        <div className="nav__links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}>
            Bandeja
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
          >
            Clientes
          </NavLink>
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<BandejaTramites />} />
          <Route path="/tramites/:id" element={<TramiteDetalle />} />
          <Route path="/clientes" element={<ListaClientes />} />
        </Routes>
      </main>
    </>
  );
}
