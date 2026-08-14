export function LoadingSpinner({ message = 'Cargando…' }) {
  return (
    <div className="loading" role="status">
      <div className="loading__spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
