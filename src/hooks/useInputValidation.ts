import { useMemo } from 'react';

/**
 * Tipos de validación disponibles
 */
export type ValidationState = 'valid' | 'invalid' | 'warning' | 'neutral';

/**
 * Resultado de validación con mensaje
 */
export interface ValidationResult {
  state: ValidationState;
  message: string;
  isValid: boolean;
}

/**
 * Configuración para validar notas
 */
interface NoteValidationConfig {
  minValue?: number;
  maxValue?: number;
  allowZero?: boolean;
}

/**
 * Configuración para validar porcentajes
 */
interface PercentageValidationConfig {
  min?: number;
  max?: number;
  allowZero?: boolean;
}

/**
 * Hook personalizado para validar valores de notas
 * @param value Valor a validar
 * @param config Configuración de validación
 * @returns Resultado de validación
 */
export const useNoteValidation = (
  value: number,
  config: NoteValidationConfig = {}
): ValidationResult => {
  const { minValue = 10, maxValue = 70, allowZero = true } = config;

  return useMemo(() => {
    // Si es 0 y se permite 0, es neutral
    if (value === 0 && allowZero) {
      return {
        state: 'neutral',
        message: '',
        isValid: true
      };
    }

    // Validar rango
    if (value < minValue || value > maxValue) {
      return {
        state: 'invalid',
        message: `La nota debe estar entre ${minValue} y ${maxValue}`,
        isValid: false
      };
    }

    // Si llegamos aquí, es válido
    return {
      state: 'valid',
      message: '',
      isValid: true
    };
  }, [value, minValue, maxValue, allowZero]);
};

/**
 * Hook personalizado para validar porcentajes
 * @param value Valor a validar
 * @param config Configuración de validación
 * @returns Resultado de validación
 */
export const usePercentageValidation = (
  value: number,
  config: PercentageValidationConfig = {}
): ValidationResult => {
  const { min = 0, max = 100, allowZero = true } = config;

  return useMemo(() => {
    // Si es 0 y se permite 0, es neutral
    if (value === 0 && allowZero) {
      return {
        state: 'neutral',
        message: '',
        isValid: true
      };
    }

    // Validar rango
    if (value < min || value > max) {
      return {
        state: 'invalid',
        message: `El porcentaje debe estar entre ${min} y ${max}%`,
        isValid: false
      };
    }

    // Si llegamos aquí, es válido
    return {
      state: 'valid',
      message: '',
      isValid: true
    };
  }, [value, min, max, allowZero]);
};

/**
 * Hook para validar múltiples valores de notas
 * @param notes Array de notas a validar
 * @param config Configuración de validación
 * @returns Array de resultados de validación
 */
export const useMultipleNotesValidation = (
  notes: Array<{ id: string; valor: number; porcentaje: number }>,
  config: NoteValidationConfig = {}
): Record<string, ValidationResult> => {
  return useMemo(() => {
    const result: Record<string, ValidationResult> = {};

    for (const note of notes) {
      // Validar nota
      const noteValidation = useNoteValidation(note.valor, config);
      result[`${note.id}-valor`] = noteValidation;

      // Validar porcentaje
      const percentageValidation = usePercentageValidation(note.porcentaje);
      result[`${note.id}-porcentaje`] = percentageValidation;
    }

    return result;
  }, [notes, config]);
};

/**
 * Hook para convertir y validar valor de entrada
 * @param value Valor como string
 * @param parser Función para parsear (parseFloat, parseInt, etc)
 * @param validator Función de validación
 * @returns Objeto con valor parseado y resultado de validación
 */
export const useParsedValidation = (
  value: string,
  parser: (val: string) => number = parseFloat,
  validator?: (val: number) => ValidationResult
): { parsedValue: number; validation: ValidationResult | null } => {
  const parsedValue = useMemo(() => {
    const parsed = parser(value);
    return isNaN(parsed) ? 0 : parsed;
  }, [value, parser]);

  const validation = useMemo(() => {
    if (!validator) return null;
    return validator(parsedValue);
  }, [parsedValue, validator]);

  return { parsedValue, validation };
};

/**
 * Hook para obtener mensaje de error contextualizado
 * @param state Estado de validación
 * @param message Mensaje personalizado
 * @returns Mensaje apropiado para mostrar
 */
export const useValidationMessage = (
  state: ValidationState,
  message: string = ''
): string => {
  return useMemo(() => {
    switch (state) {
      case 'invalid':
        return message || 'Valor inválido';
      case 'warning':
        return message || 'Advertencia: valor parcial';
      case 'valid':
        return '✓ Válido';
      case 'neutral':
      default:
        return '';
    }
  }, [state, message]);
};

/**
 * Hook para generar atributos de accesibilidad basado en validación
 * @param state Estado de validación
 * @param errorId ID del elemento que contiene el error
 * @returns Objeto con atributos ARIA
 */
export const useValidationAriaAttributes = (
  state: ValidationState,
  errorId?: string
) => {
  return useMemo(
    () => ({
      'aria-invalid': state === 'invalid',
      ...(errorId && state === 'invalid' && { 'aria-describedby': errorId })
    }),
    [state, errorId]
  );
};
