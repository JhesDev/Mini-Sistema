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
    <section>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bandeja de trámites</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Gestión integral de trámites vehiculares, seguimiento de estado y asignaciones
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Nuevo trámite</Button>
      </header>

      {feedback && (
        <Alert type="success" onClose={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}

      <div className="space-y-3 mb-6">
        <input
          type="search"
          placeholder="Buscar por código (INM-…) o documento/nombre del cliente…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              estado === ''
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
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
              className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                estado === e
                  ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
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
          {isFetching && (
            <p className="text-xs text-slate-400 mb-2 italic">Actualizando información…</p>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {meta.rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                        No se encontraron trámites
                      </td>
                    </tr>
                  ) : (
                    meta.rows.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                          {t.codigo}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="font-medium text-slate-900">{nombreCliente(t.cliente)}</div>
                          {t.cliente && (
                            <div className="text-xs text-slate-500">
                              {t.cliente.tipo_doc} {t.cliente.num_doc}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                          {vehiculoLabel(t)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Badge estado={t.estado} />
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {formatFecha(t.created_at)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                              to={`/tramites/${t.id}`}
                            >
                              Ver
                            </Link>
                            {puedeCambiarEstado(t.estado) && (
                              <Button
                                variant="link"
                                onClick={() => setTramiteEstado(t)}
                                className="text-xs font-medium text-slate-600 hover:text-slate-900"
                              >
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
