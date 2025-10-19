/**
 * Resultado del cálculo de recuperación
 */
interface RecuperacionResult {
  esPosible: boolean;
  mensaje: string;
  notaMinimaNecesaria: number;
  porcentajeRestante: number;
}

/**
 * Props de la sección de recuperación
 */
interface RecuperacionSectionProps {
  calculoRecuperacion: RecuperacionResult;
}

/**
 * Componente de análisis de recuperación
 * Analiza si es posible aprobar con el porcentaje restante disponible
 */
export const RecuperacionSection = ({ calculoRecuperacion }: RecuperacionSectionProps) => {
  return (
    <section className="recuperacion-section" aria-label="Análisis de recuperación">
      <h3 id="recuperacion-title">Análisis de Recuperación</h3>

      <div className="recuperacion-descripcion">
        <p>🔍 <strong>Análisis automático:</strong> Calcula si puedes aprobar usando TODO el porcentaje restante.</p>
      </div>

      <div
        className={`recuperacion-resultado ${calculoRecuperacion.esPosible ? 'posible' : 'imposible'}`}
        role="status"
        aria-live="polite"
        aria-labelledby="recuperacion-title"
        aria-label={`${calculoRecuperacion.esPosible ? 'Es posible recuperarse' : 'No es posible recuperarse'}. ${calculoRecuperacion.mensaje}`}
      >
        <span className="status-icon" aria-hidden="true">
          {calculoRecuperacion.esPosible ? '✅' : '❌'}
        </span>
        <span>{calculoRecuperacion.mensaje}</span>
      </div>

      {calculoRecuperacion.porcentajeRestante > 0 && (
        <small className="info-adicional" id="recuperacion-info">
          Porcentaje disponible: {calculoRecuperacion.porcentajeRestante.toFixed(1)}%
        </small>
      )}
    </section>
  );
};
