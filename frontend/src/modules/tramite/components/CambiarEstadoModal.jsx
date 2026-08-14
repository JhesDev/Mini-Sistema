import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';
import {
  getTransicionesValidas,
  ESTADO_LABELS,
} from '@/shared/constants/tramiteEstados';
import { useCambiarEstadoTramite } from '../hooks/useTramites';

export function CambiarEstadoModal({ open, onClose, tramite, onSuccess }) {
  const cambiar = useCambiarEstadoTramite();
  const transiciones = tramite ? getTransicionesValidas(tramite.estado) : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { estado: '', comentario: '', usuario: 'operador' },
  });

  const handleClose = () => {
    reset();
    cambiar.reset();
    onClose();
  };

  const onSubmit = async (values) => {
    if (!tramite) return;
    try {
      const response = await cambiar.mutateAsync({
        id: tramite.id,
        body: {
          estado: values.estado,
          comentario: values.comentario?.trim() || undefined,
          usuario: values.usuario.trim() || 'operador',
        },
      });
      onSuccess?.(response.data);
      handleClose();
    } catch {
      // error shown below
    }
  };

  if (!tramite) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Cambiar estado" size="md">
      <p className="modal__intro">
        Trámite <strong>{tramite.codigo}</strong> — estado actual:{' '}
        <strong>{ESTADO_LABELS[tramite.estado] ?? tramite.estado}</strong>
      </p>

      {transiciones.length === 0 ? (
        <Alert type="info">Este trámite no admite más cambios de estado.</Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {cambiar.isError && <Alert>{cambiar.error?.message}</Alert>}

          <div className="form-field">
            <label htmlFor="estado">Nuevo estado *</label>
            <select
              id="estado"
              className={`input ${errors.estado ? 'input--error' : ''}`}
              defaultValue=""
              {...register('estado', { required: 'Seleccione el nuevo estado' })}
            >
              <option value="" disabled>
                Seleccione una transición
              </option>
              {transiciones.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABELS[e] ?? e}
                </option>
              ))}
            </select>
            {errors.estado && <span className="field-error">{errors.estado.message}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="comentario">Comentario</label>
            <textarea
              id="comentario"
              rows={3}
              maxLength={500}
              className="input"
              placeholder="Motivo del cambio de estado…"
              {...register('comentario', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
            />
            {errors.comentario && (
              <span className="field-error">{errors.comentario.message}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="usuario-estado">Usuario</label>
            <input id="usuario-estado" className="input" {...register('usuario')} />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={cambiar.isPending}>
              Confirmar cambio
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
