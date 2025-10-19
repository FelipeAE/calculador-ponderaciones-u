/**
 * Props de la sección de resultados
 */
interface ResultadosSectionProps {
  promedioActual: number;
  promedioFinal: number;
  modoExamen: boolean;
  notaExamen: number;
  notaAprobacion: number;
}

/**
 * Componente que muestra los resultados de los cálculos
 * Displays current average y final average (si hay examen)
 */
export const ResultadosSection = ({
  promedioActual,
  promedioFinal,
  modoExamen,
  notaExamen,
  notaAprobacion
}: ResultadosSectionProps) => {
  // Determinar estado de aprobación
  const aprobado = promedioFinal >= notaAprobacion;
  const estado = aprobado ? 'Aprobado' : 'Reprobado';
  const ariaLabel = `${estado}. Promedio: ${promedioFinal.toFixed(1)}`;

  return (
    <div className="resultados" role="region" aria-label="Resultados de cálculos">
      {/* Resultado de promedio actual */}
      <div className="resultado">
        <h3 id="promedio-actual-title">Promedio Actual</h3>
        <div
          className="valor"
          role="status"
          aria-labelledby="promedio-actual-title"
          aria-label={`Promedio actual: ${promedioActual.toFixed(2)}`}
        >
          {promedioActual.toFixed(2)}
        </div>
      </div>

      {/* Resultado de promedio final (con examen) */}
      {modoExamen && (
        <div className={`resultado status-${aprobado ? 'aprobado' : 'reprobado'}`}>
          <h3 id="promedio-final-title">Promedio Final (con examen)</h3>
          <div
            className="valor"
            role="status"
            aria-labelledby="promedio-final-title"
            aria-label={`Promedio final: ${promedioFinal.toFixed(2)}`}
          >
            {promedioFinal.toFixed(2)}
          </div>
          {notaExamen > 0 && (
            <div
              className={`estado-final ${aprobado ? 'aprobado' : 'reprobado'}`}
              role="alert"
              aria-live="assertive"
              aria-label={ariaLabel}
            >
              <span className="status-icon" aria-hidden="true">
                {aprobado ? '✓' : '✗'}
              </span>
              <span>
                {aprobado
                  ? `¡Aprobado! Nota final: ${promedioFinal.toFixed(1)}`
                  : `Reprobado. Nota final: ${promedioFinal.toFixed(1)}`
                }
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
