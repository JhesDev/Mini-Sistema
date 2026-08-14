import { Button } from './Button';

export function Pagination({ page, totalPages, onPageChange, limit, onLimitChange }) {
  if (!totalPages || totalPages < 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <div className="pagination__info">
        Página {page} de {totalPages}
      </div>
      <div className="pagination__controls">
        <label className="pagination__limit">
          Por página
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <Button variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <Button variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
