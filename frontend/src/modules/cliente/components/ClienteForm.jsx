import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';

const TIPOS_DOC = ['DNI', 'CE', 'RUC'];

const inputClass = (hasError) =>
  `w-full rounded-lg border ${
    hasError ? 'border-red-300 ring-1 ring-red-500' : 'border-slate-300'
  } bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs`;

export function ClienteForm({ cliente, onSubmit, loading, serverError, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo_doc: cliente?.tipo_doc ?? 'DNI',
      num_doc: cliente?.num_doc ?? '',
      nombres: cliente?.nombres ?? '',
      ap_paterno: cliente?.ap_paterno ?? '',
      ap_materno: cliente?.ap_materno ?? '',
      email: cliente?.email ?? '',
      telefono: cliente?.telefono ?? '',
      fecha_nac: cliente?.fecha_nac ? String(cliente.fecha_nac).slice(0, 10) : '',
    },
  });

  const submitHandler = (values) => {
    onSubmit({
      tipo_doc: values.tipo_doc,
      num_doc: values.num_doc.trim(),
      nombres: values.nombres.trim(),
      ap_paterno: values.ap_paterno.trim(),
      ap_materno: values.ap_materno?.trim() || null,
      email: values.email?.trim() || null,
      telefono: values.telefono?.trim() || null,
      fecha_nac: values.fecha_nac || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {serverError && <Alert>{serverError}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="tipo_doc" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Tipo de documento *
          </label>
          <select
            id="tipo_doc"
            className={inputClass(errors.tipo_doc)}
            {...register('tipo_doc', { required: 'El tipo de documento es obligatorio' })}
          >
            {TIPOS_DOC.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipo_doc && (
            <span className="block text-xs text-red-600 font-medium">{errors.tipo_doc.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="num_doc" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Número de documento *
          </label>
          <input
            id="num_doc"
            maxLength={20}
            className={inputClass(errors.num_doc)}
            {...register('num_doc', {
              required: 'El número de documento es obligatorio',
              maxLength: { value: 20, message: 'Máximo 20 caracteres' },
            })}
          />
          {errors.num_doc && (
            <span className="block text-xs text-red-600 font-medium">{errors.num_doc.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="nombres" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Nombres *
        </label>
        <input
          id="nombres"
          maxLength={100}
          className={inputClass(errors.nombres)}
          {...register('nombres', {
            required: 'Los nombres son obligatorios',
            maxLength: { value: 100, message: 'Máximo 100 caracteres' },
          })}
        />
        {errors.nombres && (
          <span className="block text-xs text-red-600 font-medium">{errors.nombres.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="ap_paterno" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Apellido paterno *
          </label>
          <input
            id="ap_paterno"
            maxLength={100}
            className={inputClass(errors.ap_paterno)}
            {...register('ap_paterno', {
              required: 'El apellido paterno es obligatorio',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
          />
          {errors.ap_paterno && (
            <span className="block text-xs text-red-600 font-medium">{errors.ap_paterno.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ap_materno" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Apellido materno
          </label>
          <input
            id="ap_materno"
            maxLength={100}
            className={inputClass(errors.ap_materno)}
            {...register('ap_materno', {
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
          />
          {errors.ap_materno && (
            <span className="block text-xs text-red-600 font-medium">{errors.ap_materno.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            maxLength={150}
            className={inputClass(errors.email)}
            {...register('email', {
              maxLength: { value: 150, message: 'Máximo 150 caracteres' },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <span className="block text-xs text-red-600 font-medium">{errors.email.message}</span>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telefono" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Teléfono
          </label>
          <input
            id="telefono"
            maxLength={20}
            className={inputClass(errors.telefono)}
            {...register('telefono', {
              maxLength: { value: 20, message: 'Máximo 20 caracteres' },
            })}
          />
          {errors.telefono && (
            <span className="block text-xs text-red-600 font-medium">{errors.telefono.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="fecha_nac" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Fecha de nacimiento
          </label>
          <input
            id="fecha_nac"
            type="date"
            className={inputClass(errors.fecha_nac)}
            {...register('fecha_nac')}
          />
          {errors.fecha_nac && (
            <span className="block text-xs text-red-600 font-medium">{errors.fecha_nac.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {cliente ? 'Guardar cambios' : 'Guardar cliente'}
        </Button>
      </div>
    </form>
  );
}
