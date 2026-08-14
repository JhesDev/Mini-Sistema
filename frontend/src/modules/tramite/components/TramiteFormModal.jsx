import { Modal } from '@/shared/components/Modal';
import { TramiteForm } from './TramiteForm';
import { useCrearTramite } from '../hooks/useTramites';

export function TramiteFormModal({ open, onClose, onSuccess }) {
  const crear = useCrearTramite();

  const handleSubmit = async (values) => {
    try {
      const response = await crear.mutateAsync(values);
      onSuccess?.(response.data);
      onClose();
    } catch {
      // error shown in form
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo trámite" size="lg">
      <TramiteForm
        onSubmit={handleSubmit}
        loading={crear.isPending}
        serverError={crear.isError ? crear.error?.message : null}
        onCancel={onClose}
      />
    </Modal>
  );
}
