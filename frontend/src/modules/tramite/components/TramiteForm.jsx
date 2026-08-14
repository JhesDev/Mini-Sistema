import { useForm, Controller } from 'react-hook-form';
import { ClienteSelector } from '@/modules/cliente';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';
import { useAuth } from '@/shared/auth';

const currentYear = new Date().getFullYear();

export function TramiteForm({ onSubmit, loading, serverError, onCancel }) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cliente_id: null,
      placa: '',
      marca: '',
      modelo: '',
      anio: currentYear,
      monto: '',
      usuario: user?.username || 'operador',
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      cliente_id: Number(values.cliente_id),
      placa: values.placa?.trim() || null,
      marca: values.marca.trim(),
      modelo: values.modelo.trim(),
      anio: Number(values.anio),
      monto: values.monto !== '' && values.monto != null ? Number(values.monto) : null,
      usuario: values.usuario.trim() || user?.username || 'operador',
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {serverError && <Alert>{serverError}</Alert>}

      <Controller
        name="cliente_id"
        control={control}
        rules={{ required: 'Seleccione un cliente' }}
        render={({ field }) => (
          <ClienteSelector
            value={field.value}
            onChange={field.onChange}
            error={errors.cliente_id}
          />
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="marca" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Marca *
          </label>
          <input
            id="marca"
            className={`w-full rounded-lg border ${
              errors.marca ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
            } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`}
            {...register('marca', { required: 'La marca es obligatoria', maxLength: 50 })}
          />
          {errors.marca && <span className="block text-xs text-red-600 font-medium">{errors.marca.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="modelo" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Modelo *
          </label>
          <input
            id="modelo"
            className={`w-full rounded-lg border ${
              errors.modelo ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
            } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`}
            {...register('modelo', { required: 'El modelo es obligatorio', maxLength: 50 })}
          />
          {errors.modelo && <span className="block text-xs text-red-600 font-medium">{errors.modelo.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="anio" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Año *
          </label>
          <input
            id="anio"
            type="number"
            className={`w-full rounded-lg border ${
              errors.anio ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
            } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`}
            {...register('anio', {
              required: 'El año es obligatorio',
              valueAsNumber: true,
              min: { value: 1990, message: 'Año mínimo: 1990' },
              max: { value: currentYear + 1, message: `Año máximo: ${currentYear + 1}` },
            })}
          />
          {errors.anio && <span className="block text-xs text-red-600 font-medium">{errors.anio.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="placa" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Placa
          </label>
          <input
            id="placa"
            className={`w-full rounded-lg border ${
              errors.placa ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
            } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`}
            maxLength={10}
            {...register('placa', { maxLength: { value: 10, message: 'Máximo 10 caracteres' } })}
          />
          {errors.placa && <span className="block text-xs text-red-600 font-medium">{errors.placa.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="monto" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Monto (S/)
          </label>
          <input
            id="monto"
            type="number"
            step="0.01"
            min="0"
            className={`w-full rounded-lg border ${
              errors.monto ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
            } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`}
            {...register('monto', {
              min: { value: 0, message: 'El monto no puede ser negativo' },
            })}
          />
          {errors.monto && <span className="block text-xs text-red-600 font-medium">{errors.monto.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="usuario" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Usuario
          </label>
          <input
            id="usuario"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            {...register('usuario', { required: 'El usuario es obligatorio' })}
          />
          {errors.usuario && <span className="block text-xs text-red-600 font-medium">{errors.usuario.message}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          Guardar trámite
        </Button>
      </div>
    </form>
  );
}
