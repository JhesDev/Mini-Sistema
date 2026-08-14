export function Alert({ type = 'error', children }) {
  return <div className={`alert alert--${type}`} role="alert">{children}</div>;
}
