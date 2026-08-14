export function LoadingSpinner({ message = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center gap-3 p-8 text-slate-500" role="status">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
