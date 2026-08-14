import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  loading = false,
  variant = 'danger',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="confirm-modal__message">{message}</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
