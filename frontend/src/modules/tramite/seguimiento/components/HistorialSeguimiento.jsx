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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <h3 className="text-base font-semibold text-slate-900 px-6 py-4 border-b border-slate-100">
        Historial de seguimiento y auditoría
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado anterior
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado nuevo
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Comentario
              </th>
              <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Usuario
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {seguimientos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  Sin registros de seguimiento
                </td>
              </tr>
            ) : (
              seguimientos.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                    {formatFechaHora(s.created_at)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {s.estado_anterior ? (
                      <Badge estado={s.estado_anterior} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge estado={s.estado_nuevo} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-800 font-medium">
                    {s.comentario ?? <span className="text-slate-400 font-normal">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                    {s.usuario}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
