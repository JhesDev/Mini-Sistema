import { useForm, Controller } from 'react-hook-form';
import { ClienteSelector } from '@/modules/cliente';
import { Button } from '@/shared/components/Button';
import { Alert } from '@/shared/components/Alert';

const currentYear = new Date().getFullYear();

export function TramiteForm({ onSubmit, loading, serverError, onCancel }) {
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
      usuario: 'operador',
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
      usuario: values.usuario.trim() || 'operador',
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="form">
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

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="marca">Marca *</label>
          <input
            id="marca"
            className={`input ${errors.marca ? 'input--error' : ''}`}
            {...register('marca', { required: 'La marca es obligatoria', maxLength: 50 })}
          />
          {errors.marca && <span className="field-error">{errors.marca.message}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="modelo">Modelo *</label>
          <input
            id="modelo"
            className={`input ${errors.modelo ? 'input--error' : ''}`}
            {...register('modelo', { required: 'El modelo es obligatorio', maxLength: 50 })}
          />
          {errors.modelo && <span className="field-error">{errors.modelo.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="anio">Año *</label>
          <input
            id="anio"
            type="number"
            className={`input ${errors.anio ? 'input--error' : ''}`}
            {...register('anio', {
              required: 'El año es obligatorio',
              valueAsNumber: true,
              min: { value: 1990, message: 'Año mínimo: 1990' },
              max: { value: currentYear + 1, message: `Año máximo: ${currentYear + 1}` },
            })}
          />
          {errors.anio && <span className="field-error">{errors.anio.message}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="placa">Placa</label>
          <input
            id="placa"
            className={`input ${errors.placa ? 'input--error' : ''}`}
            maxLength={10}
            {...register('placa', { maxLength: { value: 10, message: 'Máximo 10 caracteres' } })}
          />
          {errors.placa && <span className="field-error">{errors.placa.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="monto">Monto (S/)</label>
          <input
            id="monto"
            type="number"
            step="0.01"
            min="0"
            className={`input ${errors.monto ? 'input--error' : ''}`}
            {...register('monto', {
              min: { value: 0, message: 'El monto no puede ser negativo' },
            })}
          />
          {errors.monto && <span className="field-error">{errors.monto.message}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            className="input"
            {...register('usuario', { required: 'El usuario es obligatorio' })}
          />
          {errors.usuario && <span className="field-error">{errors.usuario.message}</span>}
        </div>
      </div>

      <div className="form-actions">
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
