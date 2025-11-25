/**
 * Resultado del simulador avanzado
 */
interface SimuladorResult {
  notaNecesaria: number;
  esPosible: boolean;
  porcentajeDisponible: number;
}

/**
 * Props del simulador avanzado
 */
interface SimuladorSectionProps {
  evaluacionesFuturas: number;
  porcentajeFuturo: number;
  simuladorAvanzado: SimuladorResult | null;
  onChangeEvaluacionesFuturas: (valor: number) => void;
  onChangePorcentajeFuturo: (valor: number) => void;
}

/**
 * Componente simulador avanzado
 * Permite simular escenarios específicos con evaluaciones futuras
 */
export const SimuladorSection = ({
  evaluacionesFuturas,
  porcentajeFuturo,
  simuladorAvanzado,
  onChangeEvaluacionesFuturas,
  onChangePorcentajeFuturo
}: SimuladorSectionProps) => {
  return (
    <fieldset className="simulador-section">
      <legend className="legend-title">Simulador Avanzado</legend>

      <div className="simulador-descripcion">
        <p>🎯 <strong>Simula escenarios específicos:</strong> Elige cuántas evaluaciones y qué porcentaje quieres simular.</p>
        <p><strong>Ejemplo:</strong> "De lo que me queda, solo quiero simular 2 pruebas que valen 25%" → Pon: 2 evaluaciones, 25%</p>
        <p className="assumption-note">
          ⚠️ <strong>Suposición:</strong> El porcentaje que NO simules se asume con nota mínima (10). Esto te da un escenario conservador.
        </p>
      </div>

      <div className="simulador-inputs" role="group" aria-label="Parámetros del simulador">
        <div className="input-group">
          <label htmlFor="evaluaciones-futuras-input">Evaluaciones futuras</label>
          <input
            id="evaluaciones-futuras-input"
            type="number"
            min="0"
            max="10"
            placeholder="ej: 3"
            value={evaluacionesFuturas || ''}
            onChange={(e) => onChangeEvaluacionesFuturas(parseInt(e.target.value) || 0)}
            className="input-simulador"
            aria-label="Cantidad de evaluaciones futuras a simular"
            aria-describedby="evaluaciones-futuras-help"
          />
          <small id="evaluaciones-futuras-help">Rango: 0 - 10</small>
        </div>

        <div className="input-group">
          <label htmlFor="porcentaje-futuro-input">% Total futuro</label>
          <input
            id="porcentaje-futuro-input"
            type="number"
            min="0"
            max="100"
            placeholder="ej: 30"
            value={porcentajeFuturo || ''}
            onChange={(e) => onChangePorcentajeFuturo(parseInt(e.target.value) || 0)}
            className="input-simulador"
            aria-label="Porcentaje total que representan las evaluaciones futuras"
            aria-describedby="porcentaje-futuro-help"
          />
          <small id="porcentaje-futuro-help">Rango: 0 - 100%</small>
        </div>
      </div>

      {simuladorAvanzado && (
        <div className="simulador-resultado" role="region" aria-label="Resultado de la simulación">
          <div
            className={`resultado-simulador ${simuladorAvanzado.esPosible ? 'posible' : 'imposible'}`}
            role="status"
            aria-live="polite"
            aria-label={`${simuladorAvanzado.esPosible ? 'Es posible' : 'No es posible'}. Necesitas promedio de ${simuladorAvanzado.notaNecesaria.toFixed(1)}`}
          >
            <span aria-hidden="true">{simuladorAvanzado.esPosible ? '✅' : '❌'}</span>
            Necesitas promedio de <strong>{simuladorAvanzado.notaNecesaria.toFixed(1)}</strong> en {evaluacionesFuturas} evaluaciones ({porcentajeFuturo}%)
          </div>
          <small id="porcentaje-disponible-info">Porcentaje disponible: {simuladorAvanzado.porcentajeDisponible}%</small>
        </div>
      )}
    </fieldset>
  );
};
