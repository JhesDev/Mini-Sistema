import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTramites } from '../hooks/useTramites';
import { useClientes } from '@/modules/cliente';
import { buildClienteSearchParams } from '@/shared/utils/search';
import { TramiteFormModal } from './TramiteFormModal';
import { CambiarEstadoModal } from './CambiarEstadoModal';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Alert } from '@/shared/components/Alert';
import { TRAMITE_ESTADOS, puedeCambiarEstado } from '@/shared/constants/tramiteEstados';
import {
  formatFecha,
  nombreCliente,
  vehiculoLabel,
} from '@/shared/utils/format';

export function BandejaTramites() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [estado, setEstado] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [clienteIdFilter, setClienteIdFilter] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [tramiteEstado, setTramiteEstado] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const isCodigoSearch = /^INM-/i.test(debouncedSearch);

  const { data: clientesData } = useClientes(
    debouncedSearch && !isCodigoSearch
      ? buildClienteSearchParams(debouncedSearch, { limit: 5, page: 1 })
      : { limit: 1, page: 1 },
  );

  useEffect(() => {
    if (!debouncedSearch || isCodigoSearch) {
      setClienteIdFilter(null);
      return;
    }
    const match = clientesData?.data?.[0];
    setClienteIdFilter(match?.id ?? null);
    setPage(1);
  }, [debouncedSearch, isCodigoSearch, clientesData]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: debouncedSearch && isCodigoSearch ? 100 : limit,
      ...(estado ? { estado } : {}),
      ...(clienteIdFilter ? { cliente_id: clienteIdFilter } : {}),
    }),
    [page, limit, estado, clienteIdFilter, debouncedSearch, isCodigoSearch],
  );

  const { data, isLoading, isError, error, isFetching } = useTramites(queryParams);

  const tramites = useMemo(() => {
    let rows = data?.data ?? [];
    if (debouncedSearch && isCodigoSearch) {
      const term = debouncedSearch.toLowerCase();
      rows = rows.filter((t) => t.codigo.toLowerCase().includes(term));
    }
    return rows;
  }, [data?.data, debouncedSearch, isCodigoSearch]);

  const meta = useMemo(() => {
    if (debouncedSearch && isCodigoSearch) {
      const total = tramites.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      return {
        page,
        limit,
        total,
        totalPages,
        rows: tramites.slice(start, start + limit),
      };
    }
    return {
      ...(data?.meta ?? { page: 1, limit, total: 0, totalPages: 1 }),
      rows: tramites,
    };
  }, [data?.meta, debouncedSearch, isCodigoSearch, tramites, page, limit]);

  const handleCreateSuccess = (tramite) => {
    setFeedback(`Trámite ${tramite.codigo} creado correctamente.`);
  };

  const handleEstadoSuccess = (tramite) => {
    setFeedback(`Estado de ${tramite.codigo} actualizado.`);
  };

  return (
    <section className="page">
      <header className="page__header page__header--actions">
        <div>
          <h1>Bandeja de trámites</h1>
          <p className="page__subtitle">
            Paginación server-side por estado y cliente; búsqueda por código es client-side sobre
            los resultados cargados.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Nuevo trámite</Button>
      </header>

      {feedback && (
        <Alert type="success">
          {feedback}
          <button type="button" className="alert__close" onClick={() => setFeedback(null)}>
            ×
          </button>
        </Alert>
      )}

      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por código (INM-…) o documento/nombre del cliente…"
          className="input filters__search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="filters__estados">
          <button
            type="button"
            className={`chip ${estado === '' ? 'chip--active' : ''}`}
            onClick={() => {
              setEstado('');
              setPage(1);
            }}
          >
            Todos
          </button>
          {TRAMITE_ESTADOS.map((e) => (
            <button
              key={e}
              type="button"
              className={`chip ${estado === e ? 'chip--active' : ''}`}
              onClick={() => {
                setEstado(e);
                setPage(1);
              }}
            >
              {e.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {debouncedSearch && !isCodigoSearch && !clienteIdFilter && (
        <Alert type="info">No se encontró un cliente que coincida con la búsqueda.</Alert>
      )}

      {isLoading && <LoadingSpinner message="Cargando trámites…" />}
      {isError && <Alert>{error?.message ?? 'Error al cargar trámites'}</Alert>}

      {!isLoading && !isError && (
        <>
          {isFetching && <p className="fetching-hint">Actualizando…</p>}

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Vehículo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {meta.rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table__empty">
                      No se encontraron trámites
                    </td>
                  </tr>
                ) : (
                  meta.rows.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.codigo}</strong>
                      </td>
                      <td>
                        <div>{nombreCliente(t.cliente)}</div>
                        {t.cliente && (
                          <small className="text-muted">
                            {t.cliente.tipo_doc} {t.cliente.num_doc}
                          </small>
                        )}
                      </td>
                      <td>{vehiculoLabel(t)}</td>
                      <td>
                        <Badge estado={t.estado} />
                      </td>
                      <td>{formatFecha(t.created_at)}</td>
                      <td>
                        <div className="table__actions">
                          <Link className="btn btn--link" to={`/tramites/${t.id}`}>
                            Ver
                          </Link>
                          {puedeCambiarEstado(t.estado) && (
                            <Button variant="link" onClick={() => setTramiteEstado(t)}>
                              Cambiar estado
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </>
      )}

      <TramiteFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={handleCreateSuccess}
      />

      <CambiarEstadoModal
        open={Boolean(tramiteEstado)}
        onClose={() => setTramiteEstado(null)}
        tramite={tramiteEstado}
        onSuccess={handleEstadoSuccess}
      />
    </section>
  );
}
