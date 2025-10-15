import { Nota } from '../types';
import { getValidationState } from '../utils/validations';

interface NotasSectionProps {
  notas: Nota[];
  porcentajeDisponible: number;
  onActualizarNota: (id: string, campo: keyof Nota, valor: string | number) => void;
  onEliminarNota: (id: string) => void;
  onAgregarNota: () => void;
  porcentajeTotal: number;
  getPorcentajeValidation: (total: number, modo: boolean, disponible: number) => string;
  modoExamen: boolean;
}

export const NotasSection = ({
  notas,
  porcentajeDisponible,
  onActualizarNota,
  onEliminarNota,
  onAgregarNota,
  porcentajeTotal,
  getPorcentajeValidation,
  modoExamen
}: NotasSectionProps) => {
  return (
    <div className="notas-section">
      <div className="ejemplo-section">
        <div className="ejemplo-titulo">Ejemplo de formato:</div>
        <div className="ejemplo-row">
          <div className="ejemplo-input">65</div>
          <div className="ejemplo-input">25</div>
          <div className="ejemplo-label">%</div>
        </div>
      </div>

      {notas.map((nota) => {
        const validationState = getValidationState(nota, porcentajeDisponible);
        return (
          <div key={nota.id} className="nota-row">
            <input
              type="number"
              placeholder="Nota"
              min="10"
              max="70"
              step="0.1"
              value={nota.valor || ''}
              onChange={(e) => onActualizarNota(nota.id, 'valor', parseFloat(e.target.value) || 0)}
              className={`input-nota validation-${validationState}`}
            />

            <input
              type="number"
              placeholder="Porcentaje"
              min="0"
              max="100"
              step="1"
              value={nota.porcentaje || ''}
              onChange={(e) => onActualizarNota(nota.id, 'porcentaje', parseInt(e.target.value) || 0)}
              className={`input-porcentaje validation-${validationState}`}
            />

            {notas.length > 3 && (
              <button
                onClick={() => onEliminarNota(nota.id)}
                className="btn-eliminar"
                aria-label="Eliminar nota"
              >
                ×
              </button>
            )}
          </div>
        );
      })}

      <button onClick={onAgregarNota} className="btn-agregar">
        + Agregar Nota
      </button>

      <div className={`porcentaje-total validation-${getPorcentajeValidation(porcentajeTotal, modoExamen, porcentajeDisponible)}`}>
        <span>Total: {porcentajeTotal}%</span>
        {modoExamen && <span> (Disponible: {porcentajeDisponible}%)</span>}
      </div>
    </div>
  );
};
