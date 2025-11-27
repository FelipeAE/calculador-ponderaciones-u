/**
 * Props de la sección de examen
 */
interface ExamenSectionProps {
  modoExamen: boolean;
  porcentajeExamen: number;
  notaExamen: number;
  notaNecesariaExamen: number;
  onChangeExamen: (checked: boolean) => void;
  onChangePorcentajeExamen: (valor: number) => void;
  onChangeNotaExamen: (valor: number) => void;
}

/**
 * Componente para la sección de configuración de examen
 * Permite activar modo examen y configurar parámetros
 */
export const ExamenSection = ({
  modoExamen,
  porcentajeExamen,
  notaExamen,
  notaNecesariaExamen,
  onChangeExamen,
  onChangePorcentajeExamen,
  onChangeNotaExamen
}: ExamenSectionProps) => {
  return (
    <fieldset className="modo-examen">
      <legend className="legend-title">Configuración de Examen</legend>

      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={modoExamen}
          onChange={(e) => onChangeExamen(e.target.checked)}
          aria-label="Activar modo examen"
        />
        <span className="checkmark" aria-hidden="true"></span>
        Dar Examen
      </label>

      {modoExamen && (
        <div className="examen-section" role="group" aria-label="Parámetros del examen">
          <div className="examen-inputs">
            <div className="input-group">
              <label htmlFor="nota-examen-input">Nota Examen</label>
              <input
                id="nota-examen-input"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={notaExamen || ''}
                onChange={(e) => onChangeNotaExamen(parseFloat(e.target.value) || 0)}
                className="input-examen-nota"
                aria-label="Ingresa tu nota del examen"
                aria-describedby="nota-examen-help"
              />
              <small id="nota-examen-help">Rango: 0 - 100</small>
            </div>

            <div className="input-group">
              <label htmlFor="porcentaje-examen-input">% Examen</label>
              <input
                id="porcentaje-examen-input"
                type="number"
                min="1"
                max="100"
                value={porcentajeExamen}
                onChange={(e) => onChangePorcentajeExamen(parseInt(e.target.value) || 30)}
                className="input-examen-porcentaje"
                aria-label="Porcentaje que vale el examen"
                aria-describedby="porcentaje-examen-help"
              />
              <small id="porcentaje-examen-help">Rango: 1 - 100%</small>
            </div>
          </div>

          <div className="examen-info">
            <div className="nota-necesaria">
              <label htmlFor="nota-necesaria-display">Nota que necesitas en el examen</label>
              <div
                id="nota-necesaria-display"
                className="valor-necesario"
                role="status"
                aria-live="polite"
                aria-label={`Nota necesaria: ${modoExamen ? notaNecesariaExamen.toFixed(1) : '0'}`}
              >
                {modoExamen ? notaNecesariaExamen.toFixed(1) : '0'}
              </div>
            </div>
          </div>
        </div>
      )}
    </fieldset>
  );
};
