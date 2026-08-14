import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useClientes, useEliminarCliente } from '../hooks/useClientes';
import { ClienteFormModal } from './ClienteFormModal';
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
  const [formOpen, setFormOpen] = useState(false);
  const [editCliente, setEditCliente] = useState(null);

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
    <section>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">Crea, actualiza y elimina clientes registrados</p>
        </div>
        <Button
          onClick={() => {
            setEditCliente(null);
            setFormOpen(true);
          }}
        >
          Nuevo cliente
        </Button>
      </header>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Buscar por nombre o documento…"
          className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          {...register('search')}
        />
      </div>

      {isLoading && <LoadingSpinner message="Cargando clientes…" />}
      {isError && <Alert>{error?.message ?? 'Error al cargar clientes'}</Alert>}

      {!isLoading && !isError && (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                        No se encontraron clientes
                      </td>
                    </tr>
                  ) : (
                    clientes.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                          {c.tipo_doc} {c.num_doc}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                          {nombreCliente(c)}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {c.email ?? '—'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {c.telefono ?? '—'}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setEditCliente(c);
                                setFormOpen(true);
                              }}
                            >
                              Editar
                            </Button>
                            <Button variant="danger" onClick={() => setDeleteId(c.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

      {formOpen && (
        <ClienteFormModal
          open={formOpen}
          cliente={editCliente}
          onClose={() => {
            setFormOpen(false);
            setEditCliente(null);
          }}
        />
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
        <div className="mt-4">
          <Alert>{eliminar.error?.message ?? 'No se pudo eliminar el cliente'}</Alert>
        </div>
      )}
    </section>
  );
}
