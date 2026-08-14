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
    <div className="form-field">
      <label htmlFor="cliente_id">Cliente *</label>
      <input
        id="cliente-search"
        type="search"
        placeholder="Buscar por nombre o documento…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />
      <select
        id="cliente_id"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className={`input ${error ? 'input--error' : ''}`}
      >
        <option value="">Seleccione un cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.tipo_doc} {c.num_doc} — {nombreCliente(c)}
          </option>
        ))}
      </select>
      {isLoading && <span className="field-hint">Cargando clientes…</span>}
      {isError && <span className="field-error">No se pudieron cargar los clientes</span>}
      {error && <span className="field-error">{error.message ?? error}</span>}
    </div>
  );
}
