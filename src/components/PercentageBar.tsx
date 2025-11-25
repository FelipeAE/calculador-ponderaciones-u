/**
 * Props del componente PercentageBar
 */
interface PercentageBarProps {
  porcentajeUsado: number;
  porcentajeExamen: number;
  modoExamen: boolean;
}

/**
 * Componente de barra de progreso que visualiza la distribución de porcentajes
 * Muestra porcentajes ingresados, examen y restante
 */
export const PercentageBar = ({ porcentajeUsado, porcentajeExamen, modoExamen }: PercentageBarProps) => {
  const porcentajeExamenUsado = modoExamen ? porcentajeExamen : 0;
  const porcentajeRestante = 100 - porcentajeUsado - porcentajeExamenUsado;

  return (
    <div className="percentage-bar-container">
      <h3 className="percentage-bar-title">
        📈 Distribución de Porcentajes
        <span className="info-tooltip" title="Visualización de cómo se distribuye el 100% de tu evaluación">ℹ️</span>
      </h3>

      <div className="percentage-bar" role="progressbar" aria-label="Distribución de porcentajes de evaluación">
        {porcentajeUsado > 0 && (
          <div
            className="bar-segment bar-entered"
            style={{ width: `${porcentajeUsado}%` }}
            title={`Notas ingresadas: ${porcentajeUsado}%`}
            aria-label={`Notas ingresadas: ${porcentajeUsado}%`}
          >
            {porcentajeUsado > 8 && <span className="bar-label">{porcentajeUsado}%</span>}
          </div>
        )}

        {modoExamen && porcentajeExamen > 0 && (
          <div
            className="bar-segment bar-exam"
            style={{ width: `${porcentajeExamen}%` }}
            title={`Examen: ${porcentajeExamen}%`}
            aria-label={`Examen: ${porcentajeExamen}%`}
          >
            {porcentajeExamen > 8 && <span className="bar-label">{porcentajeExamen}%</span>}
          </div>
        )}

        {porcentajeRestante > 0 && (
          <div
            className="bar-segment bar-remaining"
            style={{ width: `${porcentajeRestante}%` }}
            title={`Pendiente: ${porcentajeRestante}%`}
            aria-label={`Pendiente: ${porcentajeRestante}%`}
          >
            {porcentajeRestante > 8 && <span className="bar-label">{porcentajeRestante}%</span>}
          </div>
        )}
      </div>

      <div className="percentage-legend">
        {porcentajeUsado > 0 && (
          <div className="legend-item">
            <span className="legend-color bar-entered-color"></span>
            <span>Ingresadas ({porcentajeUsado}%)</span>
          </div>
        )}
        {modoExamen && porcentajeExamen > 0 && (
          <div className="legend-item">
            <span className="legend-color bar-exam-color"></span>
            <span>Examen ({porcentajeExamen}%)</span>
          </div>
        )}
        {porcentajeRestante > 0 && (
          <div className="legend-item">
            <span className="legend-color bar-remaining-color"></span>
            <span>Pendiente ({porcentajeRestante}%)</span>
          </div>
        )}
      </div>
    </div>
  );
};
