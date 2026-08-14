const VARIANTS = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  danger: 'btn--danger',
  ghost: 'btn--ghost',
  link: 'btn--link',
};

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn ${VARIANTS[variant] ?? ''} ${className}`.trim()}
      {...props}
    >
      {loading ? 'Cargando…' : children}
    </button>
  );
}
