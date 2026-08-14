import { Badge } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Alert } from '@/shared/components/Alert';
import { formatFechaHora } from '@/shared/utils/format';
import { useSeguimientos } from '../hooks/useSeguimientos';

export function HistorialSeguimiento({ tramiteId }) {
  const { data, isLoading, isError, error } = useSeguimientos(tramiteId);
  const seguimientos = data?.data ?? [];

  if (isLoading) return <LoadingSpinner message="Cargando historial…" />;
  if (isError) return <Alert>{error?.message ?? 'Error al cargar el historial'}</Alert>;

  return (
    <div className="table-wrapper">
      <h3 className="section-title">Historial de seguimiento</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estado anterior</th>
            <th>Estado nuevo</th>
            <th>Comentario</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {seguimientos.length === 0 ? (
            <tr>
              <td colSpan={5} className="table__empty">
                Sin registros de seguimiento
              </td>
            </tr>
          ) : (
            seguimientos.map((s) => (
              <tr key={s.id}>
                <td>{formatFechaHora(s.created_at)}</td>
                <td>
                  {s.estado_anterior ? (
                    <Badge estado={s.estado_anterior} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <Badge estado={s.estado_nuevo} />
                </td>
                <td>{s.comentario ?? '—'}</td>
                <td>{s.usuario}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
