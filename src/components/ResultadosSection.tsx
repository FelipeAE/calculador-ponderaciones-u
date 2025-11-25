import { PromedioProyectadoResult } from '../types';

/**
 * Props de la sección de resultados
 */
interface ResultadosSectionProps {
  promedioActual: number;
  promedioFinal: number;
  promedioProyectado: PromedioProyectadoResult;
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
  promedioProyectado,
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
      {/* Resultado de promedio de notas ingresadas */}
      <div className="resultado">
        <h3 id="promedio-actual-title">
          Promedio de Notas Ingresadas
          <span className="info-tooltip" title="Este promedio considera únicamente las notas y porcentajes que ingresaste manualmente. No incluye proyecciones ni evaluaciones futuras.">ℹ️</span>
        </h3>
        <div
          className="valor"
          role="status"
          aria-labelledby="promedio-actual-title"
          aria-label={`Promedio de notas ingresadas: ${promedioActual.toFixed(2)}`}
        >
          {promedioActual.toFixed(2)}
        </div>
        <small className="resultado-subtitle">Solo notas que ya ingresaste</small>
      </div>

      {/* Promedio Proyectado - solo mostrar si hay porcentaje restante */}
      {promedioProyectado.porcentajeRestante > 0 && (
        <div className="resultado resultado-proyectado">
          <h3 id="promedio-proyectado-title">
            Promedio Proyectado
            <span className="info-tooltip" title="Este valor estima tu promedio final asumiendo que obtendrás la nota mínima (10) en el porcentaje restante.">ℹ️</span>
          </h3>
          <div
            className="valor"
            role="status"
            aria-labelledby="promedio-proyectado-title"
            aria-label={`Promedio proyectado: ${promedioProyectado.promedio.toFixed(2)}`}
          >
            {promedioProyectado.promedio.toFixed(2)}
          </div>
          <small className="proyeccion-detalle">
            Asume nota mínima (10) para el {promedioProyectado.porcentajeRestante}% restante
          </small>
        </div>
      )}

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
