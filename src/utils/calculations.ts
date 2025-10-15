import { Nota } from '../types';

/**
 * Calcula el promedio actual sin incluir examen
 * @param notas Array de notas con valor y porcentaje
 * @returns Promedio ponderado
 */
export const calcularPromedioActual = (notas: Nota[]): number => {
  const notasValidas = notas.filter(nota => nota.porcentaje > 0);
  if (notasValidas.length === 0) return 0;

  const suma = notasValidas.reduce((acc, nota) =>
    acc + (nota.valor * nota.porcentaje / 100), 0
  );

  return suma;
};

/**
 * Calcula el promedio final incluyendo el examen
 * @param notas Array de notas
 * @param porcentajeExamen Porcentaje que vale el examen
 * @param notaExamen Calificación del examen
 * @returns Promedio final ponderado
 */
export const calcularPromedioFinal = (
  notas: Nota[],
  porcentajeExamen: number,
  notaExamen: number
): number => {
  const porcentajeNotasUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);

  if (porcentajeNotasUsado === 0) {
    return (notaExamen * porcentajeExamen / 100);
  }

  const promedioNotasSinExamen = notas.reduce((acc, nota) =>
    acc + (nota.valor * nota.porcentaje / 100), 0
  );

  const porcentajeRestante = 100 - porcentajeExamen;
  const factorAjuste = porcentajeRestante / porcentajeNotasUsado;

  const promedioNotasAjustado = promedioNotasSinExamen * factorAjuste;
  const promedioExamen = (notaExamen * porcentajeExamen / 100);

  return promedioNotasAjustado + promedioExamen;
};

/**
 * Calcula la nota necesaria en el examen para aprobar
 * @param notas Array de notas
 * @param porcentajeExamen Porcentaje que vale el examen
 * @param notaAprobacion Nota mínima para aprobar
 * @returns Nota necesaria en el examen
 */
export const calcularNotaNecesariaExamen = (
  notas: Nota[],
  porcentajeExamen: number,
  notaAprobacion: number
): number => {
  const porcentajeNotasUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
  const porcentajeRestante = 100 - porcentajeExamen;

  if (porcentajeNotasUsado === 0) {
    return Math.max(0, ((notaAprobacion * 100 / porcentajeExamen)));
  }

  const promedioNotasSinExamen = notas.reduce((acc, nota) =>
    acc + (nota.valor * nota.porcentaje / 100), 0
  );

  const factorAjuste = porcentajeRestante / porcentajeNotasUsado;
  const promedioNotasAjustado = promedioNotasSinExamen * factorAjuste;

  const notaNecesaria = (notaAprobacion - promedioNotasAjustado) * 100 / porcentajeExamen;
  return Math.max(0, notaNecesaria);
};

/**
 * Calcula la nota necesaria en evaluaciones futuras para aprobar
 * @param notas Array de notas
 * @param modoExamen Si está en modo examen
 * @param porcentajeExamen Porcentaje del examen
 * @param evaluacionesFuturas Cantidad de evaluaciones futuras
 * @param porcentajeFuturo Porcentaje total futuro
 * @param notaAprobacion Nota mínima para aprobar
 * @param promedioActual Promedio actual
 * @param promedioFinal Promedio final (con examen)
 * @returns Objeto con nota necesaria y si es posible
 */
export const calcularSimuladorAvanzado = (
  notas: Nota[],
  modoExamen: boolean,
  porcentajeExamen: number,
  evaluacionesFuturas: number,
  porcentajeFuturo: number,
  notaAprobacion: number,
  promedioActual: number,
  promedioFinal: number
) => {
  const porcentajeUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
  const porcentajeExamenUsado = modoExamen ? porcentajeExamen : 0;
  const porcentajeDisponibleTotal = 100 - porcentajeUsado - porcentajeExamenUsado;

  if (evaluacionesFuturas === 0 || porcentajeFuturo === 0 || porcentajeFuturo > porcentajeDisponibleTotal) {
    return null;
  }

  const promedioHastaAhora = modoExamen ? promedioFinal : promedioActual;
  const porcentajeAcumulado = porcentajeUsado + porcentajeExamenUsado;

  const notaNecesariaFutura = (notaAprobacion - (promedioHastaAhora * porcentajeAcumulado / 100)) / (porcentajeFuturo / 100);

  const esPosible = notaNecesariaFutura <= 70; // Nota máxima

  return {
    notaNecesaria: Math.max(0, notaNecesariaFutura),
    esPosible,
    porcentajeDisponible: porcentajeDisponibleTotal
  };
};

/**
 * Calcula si es posible recuperarse con el porcentaje restante
 * @param notas Array de notas
 * @param modoExamen Si está en modo examen
 * @param porcentajeExamen Porcentaje del examen
 * @param promedioActual Promedio actual
 * @param promedioFinal Promedio final (con examen)
 * @param notaAprobacion Nota mínima para aprobar
 * @returns Objeto con análisis de recuperación
 */
export const calcularRecuperacion = (
  notas: Nota[],
  modoExamen: boolean,
  porcentajeExamen: number,
  promedioActual: number,
  promedioFinal: number,
  notaAprobacion: number
) => {
  const porcentajeUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
  const porcentajeExamenUsado = modoExamen ? porcentajeExamen : 0;
  const porcentajeRestante = 100 - porcentajeUsado - porcentajeExamenUsado;

  if (porcentajeRestante <= 0) {
    const promedioFinalActual = modoExamen ? promedioFinal : promedioActual;
    return {
      esPosible: promedioFinalActual >= notaAprobacion,
      mensaje: promedioFinalActual >= notaAprobacion
        ? "¡Ya tienes la nota para aprobar!"
        : "No es posible aprobar con las notas actuales",
      notaMinimaNecesaria: 0,
      porcentajeRestante: 0
    };
  }

  const promedioHastaAhora = modoExamen ? promedioFinal : promedioActual;
  const porcentajeAcumulado = porcentajeUsado + porcentajeExamenUsado;

  const notaMinimaNecesaria = (notaAprobacion - (promedioHastaAhora * porcentajeAcumulado / 100)) / (porcentajeRestante / 100);

  const esPosible = notaMinimaNecesaria <= 70;

  return {
    esPosible,
    mensaje: esPosible
      ? `Necesitas promedio mínimo de ${Math.max(0, notaMinimaNecesaria).toFixed(1)} en el ${porcentajeRestante}% restante`
      : `Imposible aprobar. Necesitarías ${notaMinimaNecesaria.toFixed(1)} en el ${porcentajeRestante}% restante`,
    notaMinimaNecesaria: Math.max(0, notaMinimaNecesaria),
    porcentajeRestante
  };
};

/**
 * Valida una nota individual
 * @param nota Valor de la nota
 * @returns Objeto con validez y mensaje de error
 */
export const validarNota = (nota: number): { valido: boolean; mensaje: string } => {
  if (nota === 0) {
    return { valido: true, mensaje: '' };
  }
  if (nota < 10 || nota > 70) {
    return { valido: false, mensaje: 'Nota debe estar entre 10 y 70' };
  }
  return { valido: true, mensaje: '' };
};

/**
 * Valida un porcentaje individual
 * @param porcentaje Valor del porcentaje
 * @param maximo Porcentaje máximo permitido
 * @returns Booleano indicando si es válido
 */
export const validarPorcentaje = (porcentaje: number, maximo: number = 100): boolean => {
  if (porcentaje === 0) {
    return true;
  }
  return porcentaje > 0 && porcentaje <= maximo;
};

/**
 * Calcula el total de porcentajes
 * @param notas Array de notas
 * @returns Suma total de porcentajes
 */
export const calcularPorcentajeTotal = (notas: Nota[]): number => {
  return notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
};

/**
 * Calcula el porcentaje disponible
 * @param modoExamen Si está en modo examen
 * @param porcentajeExamen Porcentaje del examen
 * @returns Porcentaje disponible
 */
export const calcularPorcentajeDisponible = (modoExamen: boolean, porcentajeExamen: number): number => {
  return modoExamen ? 100 - porcentajeExamen : 100;
};
