import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useClientes, useEliminarCliente } from '../hooks/useClientes';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Alert } from '@/shared/components/Alert';
import { nombreCliente } from '@/shared/utils/format';
import { buildClienteSearchParams } from '@/shared/utils/search';

export function ListaClientes() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState(null);

  const { register, watch } = useForm({ defaultValues: { search: '' } });
  const search = watch('search');

  const params = buildClienteSearchParams(search, { page, limit });

  const { data, isLoading, isError, error } = useClientes(params);
  const eliminar = useEliminarCliente();

  const clientes = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1 };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await eliminar.mutateAsync(deleteId);
      setDeleteId(null);
    } catch {
      // error shown via mutation state
    }
  };

  return (
    <section className="page">
      <header className="page__header">
        <h1>Clientes</h1>
        <p className="page__subtitle">Consulta y elimina clientes registrados</p>
      </header>

      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por nombre o documento…"
          className="input"
          {...register('search')}
        />
      </div>

      {isLoading && <LoadingSpinner message="Cargando clientes…" />}
      {isError && <Alert>{error?.message ?? 'Error al cargar clientes'}</Alert>}

      {!isLoading && !isError && (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Documento</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table__empty">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientes.map((c) => (
                    <tr key={c.id}>
                      <td>
                        {c.tipo_doc} {c.num_doc}
                      </td>
                      <td>{nombreCliente(c)}</td>
                      <td>{c.email ?? '—'}</td>
                      <td>{c.telefono ?? '—'}</td>
                      <td>
                        <Button variant="danger" onClick={() => setDeleteId(c.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar cliente"
        message="¿Está seguro de eliminar este cliente? No podrá eliminarse si tiene trámites asociados."
        confirmLabel="Eliminar"
        loading={eliminar.isPending}
      />

      {eliminar.isError && (
        <Alert>{eliminar.error?.message ?? 'No se pudo eliminar el cliente'}</Alert>
      )}
    </section>
  );
}
