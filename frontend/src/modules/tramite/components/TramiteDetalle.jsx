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
    <section className="page">
      <header className="page__header page__header--actions">
        <div>
          <Link to="/" className="back-link">
            ← Volver a la bandeja
          </Link>
          <h1>Trámite {tramite.codigo}</h1>
          <Badge estado={tramite.estado} />
        </div>
        {puedeCambiarEstado(tramite.estado) && (
          <Button onClick={() => setShowCambiarEstado(true)}>Cambiar estado</Button>
        )}
      </header>

      {feedback && (
        <Alert type="success">
          {feedback}
          <button type="button" className="alert__close" onClick={() => setFeedback(null)}>
            ×
          </button>
        </Alert>
      )}

      <div className="detail-grid">
        <article className="card">
          <h2 className="card__title">Datos del trámite</h2>
          <dl className="detail-list">
            <div>
              <dt>Código</dt>
              <dd>{tramite.codigo}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <Badge estado={tramite.estado} />
              </dd>
            </div>
            <div>
              <dt>Marca / Modelo</dt>
              <dd>
                {tramite.marca} {tramite.modelo} ({tramite.anio})
              </dd>
            </div>
            <div>
              <dt>Placa</dt>
              <dd>{tramite.placa ?? '—'}</dd>
            </div>
            <div>
              <dt>Monto</dt>
              <dd>{formatMonto(tramite.monto)}</dd>
            </div>
            <div>
              <dt>Registrado</dt>
              <dd>{formatFechaHora(tramite.created_at)}</dd>
            </div>
            <div>
              <dt>Última actualización</dt>
              <dd>{formatFechaHora(tramite.updated_at)}</dd>
            </div>
          </dl>
        </article>

        <article className="card">
          <h2 className="card__title">Cliente</h2>
          {cliente ? (
            <dl className="detail-list">
              <div>
                <dt>Nombre</dt>
                <dd>{nombreCliente(cliente)}</dd>
              </div>
              <div>
                <dt>Documento</dt>
                <dd>
                  {cliente.tipo_doc} {cliente.num_doc}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{cliente.email ?? '—'}</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>{cliente.telefono ?? '—'}</dd>
              </div>
              <div>
                <dt>Fecha nac.</dt>
                <dd>{cliente.fecha_nac ? formatFecha(cliente.fecha_nac) : '—'}</dd>
              </div>
            </dl>
          ) : (
            <p>Sin datos de cliente</p>
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
