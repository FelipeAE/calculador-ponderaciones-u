import { PromedioProyectadoResult } from '../types';

/**
 * Props del componente GradeBreakdown
 */
interface GradeBreakdownProps {
  promedioActual: number;
  promedioProyectado: PromedioProyectadoResult;
  porcentajeUsado: number;
  modoExamen: boolean;
  porcentajeExamen: number;
}

/**
 * Componente que muestra un desglose visual de cómo se calcula el promedio
 * Ayuda a entender la composición del promedio proyectado
 */
export const GradeBreakdown = ({
  promedioActual,
  promedioProyectado,
  porcentajeUsado,
  modoExamen,
  porcentajeExamen
}: GradeBreakdownProps) => {
  // Solo mostrar si hay porcentaje restante
  if (promedioProyectado.porcentajeRestante <= 0) {
    return null;
  }

  return (
    <div className="grade-breakdown">
      <h3 className="breakdown-title">
        📊 Desglose de Promedio
        <span className="info-tooltip" title="Visualización de cómo se compone tu promedio proyectado">ℹ️</span>
      </h3>

      <div className="breakdown-content">
        <div className="breakdown-item breakdown-entered">
          <div className="breakdown-label">
            <span className="breakdown-icon">✅</span>
            <span>Notas ingresadas ({porcentajeUsado}%)</span>
          </div>
          <div className="breakdown-value">
            {promedioActual.toFixed(2)} puntos
          </div>
        </div>

        {promedioProyectado.porcentajeRestante > 0 && (
          <div className="breakdown-item breakdown-projected">
            <div className="breakdown-label">
              <span className="breakdown-icon">📝</span>
              <div className="breakdown-label-text">
                <span>Proyección restante ({promedioProyectado.porcentajeRestante}%)</span>
                <small>Asumiendo nota 10</small>
              </div>
            </div>
            <div className="breakdown-value">
              +{promedioProyectado.contribucionRestante.toFixed(2)} puntos
            </div>
          </div>
        )}

        {modoExamen && (
          <div className="breakdown-item breakdown-exam">
            <div className="breakdown-label">
              <span className="breakdown-icon">📚</span>
              <div className="breakdown-label-text">
                <span>Examen ({porcentajeExamen}%)</span>
                <small>Configurado aparte</small>
              </div>
            </div>
            <div className="breakdown-value">
              Ver sección examen
            </div>
          </div>
        )}

        <div className="breakdown-divider"></div>

        <div className="breakdown-total">
          <div className="breakdown-total-label">
            <strong>Promedio Proyectado Total:</strong>
          </div>
          <div className="breakdown-total-value">
            <strong>{promedioProyectado.promedio.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
