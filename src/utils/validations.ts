import { Nota } from '../types';

export type ValidationState = 'valid' | 'invalid' | 'warning' | 'neutral';

/**
 * Obtiene el estado de validación de una nota
 * @param nota Objeto nota a validar
 * @param porcentajeDisponible Porcentaje máximo disponible
 * @returns Estado de validación
 */
export const getValidationState = (nota: Nota, porcentajeDisponible: number): ValidationState => {
  if (nota.valor === 0 && nota.porcentaje === 0) return 'neutral';

  const isNotaValid = nota.valor >= 10 && nota.valor <= 70;
  const isPorcentajeValid = nota.porcentaje > 0 && nota.porcentaje <= porcentajeDisponible;

  if (isNotaValid && isPorcentajeValid) return 'valid';
  if (!isNotaValid || !isPorcentajeValid) return 'invalid';

  return 'neutral';
};

/**
 * Obtiene el estado de validación del total de porcentajes
 * @param porcentajeTotal Total de porcentajes
 * @param modoExamen Si está en modo examen
 * @param porcentajeDisponible Porcentaje disponible
 * @returns Estado de validación
 */
export const getPorcentajeValidation = (
  porcentajeTotal: number,
  modoExamen: boolean,
  porcentajeDisponible: number
): ValidationState => {
  if (porcentajeTotal === 0) return 'neutral';

  const limite = modoExamen ? porcentajeDisponible : 100;

  if (porcentajeTotal === limite) return 'valid';
  if (porcentajeTotal > limite) return 'invalid';
  if (porcentajeTotal < limite && porcentajeTotal > 0) return 'warning';

  return 'neutral';
};

/**
 * Valida si todas las notas son válidas
 * @param notas Array de notas
 * @param porcentajeDisponible Porcentaje disponible
 * @returns Booleano indicando si todas son válidas
 */
export const validarTodasLasNotas = (notas: Nota[], porcentajeDisponible: number): boolean => {
  return notas.every(nota => {
    const state = getValidationState(nota, porcentajeDisponible);
    return state === 'valid' || state === 'neutral';
  });
};

/**
 * Obtiene mensaje de error para un rango de notas
 * @returns Mensaje de error
 */
export const getMensajeErrorNota = (): string => {
  return 'La nota debe estar entre 10 y 70';
};

/**
 * Obtiene mensaje de error para porcentaje excedido
 * @param actual Porcentaje actual
 * @param maximo Porcentaje máximo
 * @param modoExamen Si está en modo examen
 * @param porcentajeExamen Porcentaje del examen (si aplica)
 * @returns Mensaje de error
 */
export const getMensajeErrorPorcentaje = (
  actual: number,
  maximo: number,
  modoExamen: boolean,
  porcentajeExamen?: number
): string => {
  if (modoExamen && porcentajeExamen) {
    return `Los porcentajes suman ${actual}% pero el máximo disponible es ${maximo}% (el examen vale ${porcentajeExamen}%)`;
  }
  return `Los porcentajes suman ${actual}% pero el máximo es ${maximo}%`;
};
