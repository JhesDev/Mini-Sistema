import { useState, useEffect } from 'react';
import { useClientes } from '../hooks/useClientes';
import { nombreCliente } from '@/shared/utils/format';
import { buildClienteSearchParams } from '@/shared/utils/search';

export function ClienteSelector({ value, onChange, error }) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = buildClienteSearchParams(debouncedSearch, { limit: debouncedSearch ? 20 : 50, page: 1 });

  const { data, isLoading, isError } = useClientes(params);
  const clientes = data?.data ?? [];

  return (
    <div className="space-y-1.5">
      <label htmlFor="cliente_id" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        Cliente *
      </label>
      <input
        id="cliente-search"
        type="search"
        placeholder="Buscar por nombre o documento…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
      />
      <select
        id="cliente_id"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={`w-full rounded-lg border ${
          error ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
        } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer`}
      >
        <option value="">Seleccione un cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.tipo_doc} {c.num_doc} — {nombreCliente(c)}
          </option>
        ))}
      </select>
      {isLoading && <span className="block text-xs text-slate-500">Cargando clientes…</span>}
      {isError && <span className="block text-xs text-red-600 font-medium">No se pudieron cargar los clientes</span>}
      {error && <span className="block text-xs text-red-600 font-medium">{error.message ?? error}</span>}
    </div>
  );
}
