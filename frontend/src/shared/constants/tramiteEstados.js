export const TRAMITE_ESTADOS = [
  'REGISTRADO',
  'EN_REVISION',
  'OBSERVADO',
  'APROBADO',
  'RECHAZADO',
  'FINALIZADO',
];

export const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ['EN_REVISION'],
  EN_REVISION: ['OBSERVADO', 'APROBADO', 'RECHAZADO'],
  OBSERVADO: ['EN_REVISION'],
  APROBADO: ['FINALIZADO'],
  RECHAZADO: [],
  FINALIZADO: [],
};

export const ESTADO_LABELS = {
  REGISTRADO: 'Registrado',
  EN_REVISION: 'En revisión',
  OBSERVADO: 'Observado',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  FINALIZADO: 'Finalizado',
};

export const ESTADO_COLORS = {
  REGISTRADO: 'gray',
  EN_REVISION: 'blue',
  OBSERVADO: 'orange',
  APROBADO: 'green',
  RECHAZADO: 'red',
  FINALIZADO: 'purple',
};

export function getTransicionesValidas(estadoActual) {
  return TRANSICIONES_PERMITIDAS[estadoActual] ?? [];
}

export function puedeCambiarEstado(estadoActual) {
  return getTransicionesValidas(estadoActual).length > 0;
}
