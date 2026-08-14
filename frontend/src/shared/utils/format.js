export function formatFecha(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatFechaHora(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonto(monto) {
  if (monto == null) return '—';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(Number(monto));
}

export function nombreCliente(cliente) {
  if (!cliente) return '—';
  return [cliente.nombres, cliente.ap_paterno, cliente.ap_materno]
    .filter(Boolean)
    .join(' ');
}

export function vehiculoLabel(tramite) {
  if (!tramite) return '—';
  const parts = [tramite.marca, tramite.modelo, tramite.anio].filter(Boolean);
  const base = parts.join(' ');
  return tramite.placa ? `${base} (${tramite.placa})` : base;
}
