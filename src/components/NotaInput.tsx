import React, { useMemo } from 'react';
import { Nota } from '../types';
import { getValidationState } from '../utils/validations';

/**
 * Props del componente NotaInput
 */
interface NotaInputProps {
  /** Objeto nota con id, valor y porcentaje */
  nota: Nota;
  /** Porcentaje máximo disponible para este input */
  porcentajeDisponible: number;
  /** Callback cuando cambia el valor de la nota */
  onChangeValor: (valor: number) => void;
  /** Callback cuando cambia el porcentaje de la nota */
  onChangePorcentaje: (porcentaje: number) => void;
  /** Callback para eliminar la nota */
  onEliminar: () => void;
  /** Indica si se puede eliminar esta nota */
  puedeEliminar: boolean;
}

/**
 * Componente reutilizable para un input de nota individual
 * Incluye validación visual y gestión de estado
 */
export const NotaInput: React.FC<NotaInputProps> = ({
  nota,
  porcentajeDisponible,
  onChangeValor,
  onChangePorcentaje,
  onEliminar,
  puedeEliminar
}) => {
  // Calcular el estado de validación
  const validationState = useMemo(
    () => getValidationState(nota, porcentajeDisponible),
    [nota, porcentajeDisponible]
  );

  // Obtener mensaje de error si es necesario
  const errorMessage = useMemo(() => {
    if (validationState === 'invalid') {
      if (nota.valor !== 0 && (nota.valor < 10 || nota.valor > 70)) {
        return 'La nota debe estar entre 10 y 70';
      }
      if (nota.porcentaje > porcentajeDisponible) {
        return `El porcentaje no puede exceder ${porcentajeDisponible}%`;
      }
    }
    return '';
  }, [validationState, nota.valor, nota.porcentaje, porcentajeDisponible]);

  return (
    <div className="nota-row" data-testid={`nota-input-${nota.id}`}>
      {/* Input de valor/nota */}
      <input
        type="number"
        placeholder="Nota"
        min="10"
        max="70"
        step="0.1"
        value={nota.valor || ''}
        onChange={(e) => onChangeValor(parseFloat(e.target.value) || 0)}
        className={`input-nota validation-${validationState}`}
        aria-label={`Valor de la nota ${nota.id}`}
        aria-invalid={validationState === 'invalid'}
        aria-describedby={errorMessage ? `error-${nota.id}` : undefined}
      />

      {/* Input de porcentaje */}
      <div className="porcentaje-group">
        <input
          type="number"
          placeholder="%"
          min="0"
          max={porcentajeDisponible}
          step="0.1"
          value={nota.porcentaje || ''}
          onChange={(e) => onChangePorcentaje(parseFloat(e.target.value) || 0)}
          className={`input-porcentaje validation-${validationState}`}
          aria-label={`Porcentaje de la nota ${nota.id}`}
          aria-invalid={validationState === 'invalid'}
          aria-describedby={errorMessage ? `error-${nota.id}` : undefined}
        />
        <span className="label-porcentaje" aria-hidden="true">%</span>
      </div>

      {/* Botón eliminar */}
      {puedeEliminar && (
        <button
          onClick={onEliminar}
          className="btn-eliminar"
          aria-label={`Eliminar nota ${nota.nombre || nota.id}`}
          title="Eliminar esta nota"
        >
          ✕
        </button>
      )}

      {/* Mensaje de error */}
      {errorMessage && (
        <div id={`error-${nota.id}`} className="error-message" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
