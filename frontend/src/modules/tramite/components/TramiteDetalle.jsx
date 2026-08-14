import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTramite } from '../hooks/useTramites';
import { HistorialSeguimiento } from '../seguimiento/components/HistorialSeguimiento';
import { CambiarEstadoModal } from './CambiarEstadoModal';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Alert } from '@/shared/components/Alert';
import { puedeCambiarEstado } from '@/shared/constants/tramiteEstados';
import {
  formatFecha,
  formatFechaHora,
  formatMonto,
  nombreCliente,
} from '@/shared/utils/format';

export function TramiteDetalle() {
  const { id } = useParams();
  const tramiteId = Number(id);
  const { data: tramite, isLoading, isError, error, refetch } = useTramite(tramiteId);
  const [showCambiarEstado, setShowCambiarEstado] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (isLoading) return <LoadingSpinner message="Cargando trámite…" />;
  if (isError) return <Alert>{error?.message ?? 'No se pudo cargar el trámite'}</Alert>;
  if (!tramite) return <Alert>Trámite no encontrado</Alert>;

  const cliente = tramite.cliente;

  return (
    <section>
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 mb-3"
        >
          ← Volver a la bandeja
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Trámite {tramite.codigo}
            </h1>
            <Badge estado={tramite.estado} />
          </div>
          {puedeCambiarEstado(tramite.estado) && (
            <Button onClick={() => setShowCambiarEstado(true)}>Cambiar estado</Button>
          )}
        </div>
      </header>

      {feedback && (
        <Alert type="success" onClose={() => setFeedback(null)}>
          {feedback}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2.5 border-b border-slate-100">
            Datos del trámite
          </h2>
          <dl className="divide-y divide-slate-100 text-sm">
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Código</dt>
              <dd className="text-slate-900 font-semibold col-span-2">{tramite.codigo}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Estado</dt>
              <dd className="col-span-2">
                <Badge estado={tramite.estado} />
              </dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Marca / Modelo</dt>
              <dd className="text-slate-900 font-medium col-span-2">
                {tramite.marca} {tramite.modelo} ({tramite.anio})
              </dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Placa</dt>
              <dd className="text-slate-900 font-medium col-span-2">{tramite.placa ?? '—'}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Monto</dt>
              <dd className="text-slate-900 font-semibold col-span-2">{formatMonto(tramite.monto)}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Registrado</dt>
              <dd className="text-slate-700 col-span-2">{formatFechaHora(tramite.created_at)}</dd>
            </div>
            <div className="py-2.5 grid grid-cols-3 gap-4">
              <dt className="text-slate-500 font-medium">Última actualización</dt>
              <dd className="text-slate-700 col-span-2">{formatFechaHora(tramite.updated_at)}</dd>
            </div>
          </dl>
        </article>

        <article className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2.5 border-b border-slate-100">
            Cliente asociado
          </h2>
          {cliente ? (
            <dl className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <dt className="text-slate-500 font-medium">Nombre</dt>
                <dd className="text-slate-900 font-semibold col-span-2">{nombreCliente(cliente)}</dd>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <dt className="text-slate-500 font-medium">Documento</dt>
                <dd className="text-slate-900 font-medium col-span-2">
                  {cliente.tipo_doc} {cliente.num_doc}
                </dd>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <dt className="text-slate-500 font-medium">Email</dt>
                <dd className="text-slate-700 col-span-2">{cliente.email ?? '—'}</dd>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <dt className="text-slate-500 font-medium">Teléfono</dt>
                <dd className="text-slate-700 col-span-2">{cliente.telefono ?? '—'}</dd>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-4">
                <dt className="text-slate-500 font-medium">Fecha nac.</dt>
                <dd className="text-slate-700 col-span-2">
                  {cliente.fecha_nac ? formatFecha(cliente.fecha_nac) : '—'}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500 py-4">Sin datos de cliente</p>
          )}
        </article>
      </div>

      <HistorialSeguimiento tramiteId={tramiteId} />

      <CambiarEstadoModal
        open={showCambiarEstado}
        onClose={() => setShowCambiarEstado(false)}
        tramite={tramite}
        onSuccess={() => {
          setFeedback('Estado actualizado correctamente.');
          refetch();
        }}
      />
    </section>
  );
}
