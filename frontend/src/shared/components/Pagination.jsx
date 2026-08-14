import { Button } from './Button';

export function Pagination({ page, totalPages, onPageChange, limit, onLimitChange }) {
  if (!totalPages || totalPages < 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 text-sm text-slate-600">
      <div className="font-medium text-slate-500">
        Página <span className="font-semibold text-slate-800">{page}</span> de{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
          Por página:
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm font-normal text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1.5">
          <Button variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
            Anterior
          </Button>
          <Button variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
