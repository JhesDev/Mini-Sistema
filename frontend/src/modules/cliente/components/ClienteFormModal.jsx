import { Modal } from '@/shared/components/Modal';
import { ClienteForm } from './ClienteForm';
import { useCrearCliente, useActualizarCliente } from '../hooks/useClientes';

export function ClienteFormModal({ open, onClose, cliente, onSuccess }) {
  const crear = useCrearCliente();
  const actualizar = useActualizarCliente();

  const isEdit = Boolean(cliente);
  const mutation = isEdit ? actualizar : crear;

  const handleSubmit = async (values) => {
    try {
      const response = isEdit
        ? await actualizar.mutateAsync({ id: cliente.id, body: values })
        : await crear.mutateAsync(values);
      onSuccess?.(response.data);
      onClose();
    } catch {
      // error shown in form
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar cliente' : 'Nuevo cliente'} size="lg">
      <ClienteForm
        cliente={cliente}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
        serverError={mutation.isError ? mutation.error?.message : null}
        onCancel={onClose}
      />
    </Modal>
  );
}
