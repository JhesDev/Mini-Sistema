import { ESTADO_COLORS, ESTADO_LABELS } from '@/shared/constants/tramiteEstados';

export function Badge({ estado }) {
  const color = ESTADO_COLORS[estado] ?? 'gray';
  const label = ESTADO_LABELS[estado] ?? estado;

  return <span className={`badge badge--${color}`}>{label}</span>;
}
