import { ESTADO_COLORS, ESTADO_LABELS } from '@/shared/constants/tramiteEstados';

const COLOR_CLASSES = {
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/15',
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15',
  orange: 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/25',
  red: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/15',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-700/15',
  gray: 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/15',
};

export function Badge({ estado, color: customColor, children }) {
  const color = customColor ?? ESTADO_COLORS[estado] ?? 'gray';
  const label = children ?? ESTADO_LABELS[estado] ?? estado;
  const colorClass = COLOR_CLASSES[color] ?? COLOR_CLASSES.gray;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${colorClass}`}
    >
      {label}
    </span>
  );
}
