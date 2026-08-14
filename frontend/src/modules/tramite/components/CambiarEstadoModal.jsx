import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';
import { useAuth } from '@/shared/auth';
import {
  getTransicionesValidas,
  ESTADO_LABELS,
} from '@/shared/constants/tramiteEstados';
import { useCambiarEstadoTramite } from '../hooks/useTramites';

export function CambiarEstadoModal({ open, onClose, tramite, onSuccess }) {
  const { user } = useAuth();
  const cambiar = useCambiarEstadoTramite();
  const transiciones = tramite ? getTransicionesValidas(tramite.estado) : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { estado: '', comentario: '', usuario: user?.username || 'operador' },
  });

  useEffect(() => {
    if (open) {
      reset({ estado: '', comentario: '', usuario: user?.username || 'operador' });
    }
  }, [open, user, reset]);

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
          usuario: values.usuario.trim() || user?.username || 'operador',
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
      <p className="text-sm text-slate-600 mb-4 pb-3 border-b border-slate-100">
        Trámite <strong className="text-slate-900">{tramite.codigo}</strong> — estado actual:{' '}
        <strong className="text-blue-600">{ESTADO_LABELS[tramite.estado] ?? tramite.estado}</strong>
      </p>

      {transiciones.length === 0 ? (
        <Alert type="info">Este trámite no admite más cambios de estado.</Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {cambiar.isError && <Alert>{cambiar.error?.message}</Alert>}

          <div className="space-y-1.5">
            <label htmlFor="estado" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Nuevo estado *
            </label>
            <select
              id="estado"
              className={`w-full rounded-lg border ${
                errors.estado ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
              } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer`}
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
            {errors.estado && <span className="block text-xs text-red-600 font-medium">{errors.estado.message}</span>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="comentario" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Comentario
            </label>
            <textarea
              id="comentario"
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs resize-none"
              placeholder="Motivo del cambio de estado…"
              {...register('comentario', { maxLength: { value: 500, message: 'Máximo 500 caracteres' } })}
            />
            {errors.comentario && (
              <span className="block text-xs text-red-600 font-medium">{errors.comentario.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="usuario-estado" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Usuario
            </label>
            <input
              id="usuario-estado"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              {...register('usuario')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
