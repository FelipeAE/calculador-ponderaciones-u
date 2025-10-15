interface SimuladorResult {
  notaNecesaria: number;
  esPosible: boolean;
  porcentajeDisponible: number;
}

interface SimuladorSectionProps {
  evaluacionesFuturas: number;
  porcentajeFuturo: number;
  simuladorAvanzado: SimuladorResult | null;
  onChangeEvaluacionesFuturas: (valor: number) => void;
  onChangePorcentajeFuturo: (valor: number) => void;
}

export const SimuladorSection = ({
  evaluacionesFuturas,
  porcentajeFuturo,
  simuladorAvanzado,
  onChangeEvaluacionesFuturas,
  onChangePorcentajeFuturo
}: SimuladorSectionProps) => {
  return (
    <div className="simulador-section">
      <h3>Simulador Avanzado</h3>
      <div className="simulador-descripcion">
        <p>🎯 <strong>Simula escenarios específicos:</strong> Elige cuántas evaluaciones y qué porcentaje quieres simular.</p>
        <p><strong>Ejemplo:</strong> "De lo que me queda, solo quiero simular 2 pruebas que valen 25%" → Pon: 2 evaluaciones, 25%</p>
      </div>
      <div className="simulador-inputs">
        <div className="input-group">
          <label>Evaluaciones futuras</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="ej: 3"
            value={evaluacionesFuturas || ''}
            onChange={(e) => onChangeEvaluacionesFuturas(parseInt(e.target.value) || 0)}
            className="input-simulador"
          />
        </div>

        <div className="input-group">
          <label>% Total futuro</label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="ej: 30"
            value={porcentajeFuturo || ''}
            onChange={(e) => onChangePorcentajeFuturo(parseInt(e.target.value) || 0)}
            className="input-simulador"
          />
        </div>
      </div>

      {simuladorAvanzado && (
        <div className="simulador-resultado">
          <div className={`resultado-simulador ${simuladorAvanzado.esPosible ? 'posible' : 'imposible'}`}>
            {simuladorAvanzado.esPosible ? '✅' : '❌'}
            Necesitas promedio de <strong>{simuladorAvanzado.notaNecesaria.toFixed(1)}</strong> en {evaluacionesFuturas} evaluaciones ({porcentajeFuturo}%)
          </div>
          <small>Porcentaje disponible: {simuladorAvanzado.porcentajeDisponible}%</small>
        </div>
      )}
    </div>
  );
};
