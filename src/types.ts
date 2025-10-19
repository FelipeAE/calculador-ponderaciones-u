/**
 * Interfaz Nota - Representa una calificación individual
 *
 * @example
 * const nota: Nota = {
 *   id: '1',
 *   nombre: 'Prueba de Matemática',
 *   valor: 65,
 *   porcentaje: 25
 * };
 */
export interface Nota {
  /** Identificador único de la nota */
  id: string;
  /** Nombre descriptivo de la nota (ej: "Prueba 1", "Tarea Final") */
  nombre: string;
  /** Valor numérico de la nota (0-70) */
  valor: number;
  /** Porcentaje que representa esta nota en el promedio (0-100) */
  porcentaje: number;
}

/**
 * Interfaz CalculadoraState - Almacena el estado de la aplicación
 * Utilizada para persistencia en localStorage y gestión de estado
 */
export interface CalculadoraState {
  /** Array de notas registradas */
  notas: Nota[];
  /** Indica si el modo examen está activo */
  modoExamen: boolean;
  /** Porcentaje que vale el examen (útil cuando modoExamen = true) */
  porcentajeExamen: number;
}

/**
 * Tipo para resultados de cálculos
 */
export interface CalculationResult {
  /** Promedio calculado */
  promedio: number;
  /** Indica si el resultado es válido */
  isValid: boolean;
  /** Mensaje descriptivo si hay error */
  mensaje?: string;
}