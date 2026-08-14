const ALERT_STYLES = {
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
};

export function Alert({ type = 'error', message, children, onClose }) {
  const style = ALERT_STYLES[type] ?? ALERT_STYLES.error;

  return (
    <div
      className={`p-3.5 rounded-lg border text-sm flex items-center justify-between gap-3 mb-4 ${style}`}
      role="alert"
    >
      <div className="flex-1">{message || children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer p-0.5"
          aria-label="Cerrar alerta"
        >
          ×
        </button>
      )}
    </div>
  );
}
