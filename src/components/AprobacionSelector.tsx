/**
 * Props del selector de nota de aprobación
 */
interface AprobacionSelectorProps {
  notaAprobacion: number;
  onChangeNotaAprobacion: (valor: number) => void;
}

/**
 * Valores predefinidos para la nota de aprobación
 */
const NOTAS_APROBACION = [40, 45, 50, 55, 60] as const;

/**
 * Componente para seleccionar la nota mínima de aprobación
 * Permite elegir entre valores predefinidos comunes en instituciones académicas
 */
export const AprobacionSelector = ({
  notaAprobacion,
  onChangeNotaAprobacion
}: AprobacionSelectorProps) => {
  return (
    <div className="aprobacion-selector" role="group" aria-label="Selección de nota de aprobación">
      <h3 className="aprobacion-title">Nota de Aprobación</h3>
      <div className="aprobacion-buttons">
        {NOTAS_APROBACION.map((nota) => (
          <button
            key={nota}
            className={`aprobacion-button ${notaAprobacion === nota ? 'active' : ''}`}
            onClick={() => onChangeNotaAprobacion(nota)}
            aria-label={`Seleccionar nota de aprobación ${nota}`}
            aria-pressed={notaAprobacion === nota}
            type="button"
          >
            {nota}
          </button>
        ))}
      </div>
      <small className="aprobacion-subtitle">
        Selecciona la nota mínima requerida para aprobar
      </small>
    </div>
  );
};
