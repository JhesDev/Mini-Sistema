export const TRAMITE_ESTADOS = [
  'REGISTRADO',
  'EN_FIRMAS',
  'PRESENTADO',
  'OBSERVADO',
  'INSCRITO',
  'CERRADO',
  'ANULADO',
];

export const TRANSICIONES_PERMITIDAS = {
  REGISTRADO: ['EN_FIRMAS', 'ANULADO'],
  EN_FIRMAS: ['PRESENTADO', 'OBSERVADO', 'ANULADO'],
  OBSERVADO: ['EN_FIRMAS', 'PRESENTADO', 'ANULADO'],
  PRESENTADO: ['INSCRITO', 'OBSERVADO'],
  INSCRITO: ['CERRADO'],
  CERRADO: [],
  ANULADO: [],
};

export const ESTADO_LABELS = {
  REGISTRADO: 'Registrado',
  EN_FIRMAS: 'En firmas',
  PRESENTADO: 'Presentado',
  OBSERVADO: 'Observado',
  INSCRITO: 'Inscrito',
  CERRADO: 'Cerrado',
  ANULADO: 'Anulado',
};

export const ESTADO_COLORS = {
  REGISTRADO: 'gray',
  EN_FIRMAS: 'blue',
  PRESENTADO: 'teal',
  OBSERVADO: 'orange',
  INSCRITO: 'green',
  CERRADO: 'purple',
  ANULADO: 'red',
};

export function getTransicionesValidas(estadoActual) {
  return TRANSICIONES_PERMITIDAS[estadoActual] ?? [];
}

export function puedeCambiarEstado(estadoActual) {
  return getTransicionesValidas(estadoActual).length > 0;
}
