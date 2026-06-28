import { useState } from 'react';
import { ResultadoInverso } from '../types';

/**
 * Props de la sección ¿Cuánto Necesito?
 */
interface CuantoNecesitoSectionProps {
  resultadoInverso: ResultadoInverso | null;
  promedioActualInverso: number;
  notasRendidas: number;
  totalNotasRamo: number;
  promedioObjetivoInverso: number;
  porcentajeManualInverso: number | null;
  onChangePromedioActual: (valor: number) => void;
  onChangeNotasRendidas: (valor: number) => void;
  onChangeTotalNotas: (valor: number) => void;
  onChangePromedioObjetivo: (valor: number) => void;
  onChangePorcentajeManual: (valor: number | null) => void;
}

/**
 * Componente "¿Cuánto Necesito?" — Calculadora Inversa
 * Permite calcular la nota necesaria para alcanzar un promedio objetivo
 * sin conocer las ponderaciones individuales de las notas anteriores
 */
export const CuantoNecesitoSection = ({
  resultadoInverso,
  promedioActualInverso,
  notasRendidas,
  totalNotasRamo,
  promedioObjetivoInverso,
  porcentajeManualInverso,
  onChangePromedioActual,
  onChangeNotasRendidas,
  onChangeTotalNotas,
  onChangePromedioObjetivo,
  onChangePorcentajeManual
}: CuantoNecesitoSectionProps) => {
  const [usarPorcentajeManual, setUsarPorcentajeManual] = useState(porcentajeManualInverso !== null);

  const handleTogglePorcentajeManual = () => {
    if (usarPorcentajeManual) {
      onChangePorcentajeManual(null);
      setUsarPorcentajeManual(false);
    } else {
      onChangePorcentajeManual(75);
      setUsarPorcentajeManual(true);
    }
  };

  const tieneInputsValidos = promedioActualInverso > 0 && totalNotasRamo > 0 && notasRendidas > 0 && promedioObjetivoInverso > 0;

  return (
    <fieldset className="cuanto-necesito-section" aria-label="¿Cuánto Necesito?">
      <legend className="legend-title">¿Cuánto Necesito?</legend>

      <div className="cuanto-necesito-descripcion">
        <p>🎯 <strong>Calcula la nota que necesitas sin conocer las ponderaciones.</strong></p>
        <p><strong>Ejemplo:</strong> "Tengo 3 notas con promedio 46, el ramo tiene 4 notas, necesito 50 para eximirme" → ¿Cuánto necesito en la última nota?</p>
        <p className="assumption-note">
          ⚠️ <strong>Suposición:</strong> Si no conoces el porcentaje acumulado, se asume distribución equitativa (cada evaluación pesa lo mismo).
        </p>
      </div>

      <div className="cuanto-necesito-inputs" role="group" aria-label="Parámetros de cálculo inverso">
        <div className="input-group">
          <label htmlFor="promedio-actual-inverso">Promedio actual</label>
          <input
            id="promedio-actual-inverso"
            type="number"
            min="10"
            max="70"
            step="0.1"
            placeholder="ej: 46"
            value={promedioActualInverso || ''}
            onChange={(e) => onChangePromedioActual(parseFloat(e.target.value) || 0)}
            className="input-simulador"
            aria-label="Promedio actual de las notas ya rendidas"
            aria-describedby="promedio-actual-help"
          />
          <small id="promedio-actual-help">Tu promedio de notas rendidas (10-70)</small>
        </div>

        <div className="input-group">
          <label htmlFor="promedio-objetivo-inverso">Promedio objetivo</label>
          <input
            id="promedio-objetivo-inverso"
            type="number"
            min="10"
            max="70"
            step="0.1"
            placeholder="ej: 50"
            value={promedioObjetivoInverso || ''}
            onChange={(e) => onChangePromedioObjetivo(parseFloat(e.target.value) || 0)}
            className="input-simulador"
            aria-label="Promedio objetivo para eximirse o aprobar"
            aria-describedby="promedio-objetivo-help"
          />
          <small id="promedio-objetivo-help">Para eximirte o aprobar (10-70)</small>
        </div>

        {!usarPorcentajeManual && (
          <>
            <div className="input-group">
              <label htmlFor="notas-rendidas-input">Notas rendidas</label>
              <input
                id="notas-rendidas-input"
                type="number"
                min="1"
                max="20"
                placeholder="ej: 3"
                value={notasRendidas || ''}
                onChange={(e) => onChangeNotasRendidas(parseInt(e.target.value) || 0)}
                className="input-simulador"
                aria-label="Cantidad de notas ya rendidas"
                aria-describedby="notas-rendidas-help"
              />
              <small id="notas-rendidas-help">Evaluaciones ya realizadas</small>
            </div>

            <div className="input-group">
              <label htmlFor="total-notas-input">Total de notas</label>
              <input
                id="total-notas-input"
                type="number"
                min="2"
                max="20"
                placeholder="ej: 4"
                value={totalNotasRamo || ''}
                onChange={(e) => onChangeTotalNotas(parseInt(e.target.value) || 0)}
                className="input-simulador"
                aria-label="Total de evaluaciones del ramo"
                aria-describedby="total-notas-help"
              />
              <small id="total-notas-help">Evaluaciones totales del ramo</small>
            </div>
          </>
        )}

        {usarPorcentajeManual && (
          <div className="input-group input-group-wide">
            <label htmlFor="porcentaje-manual-input">% Acumulado</label>
            <input
              id="porcentaje-manual-input"
              type="number"
              min="1"
              max="99"
              step="0.1"
              placeholder="ej: 75"
              value={porcentajeManualInverso || ''}
              onChange={(e) => onChangePorcentajeManual(parseFloat(e.target.value) || 0)}
              className="input-simulador"
              aria-label="Porcentaje acumulado de las notas rendidas"
              aria-describedby="porcentaje-manual-help"
            />
            <small id="porcentaje-manual-help">% que representan tus notas (1-99)</small>
          </div>
        )}
      </div>

      <div className="cuanto-necesito-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={usarPorcentajeManual}
            onChange={handleTogglePorcentajeManual}
            aria-label="Usar porcentaje acumulado manual"
          />
          <span>Conozco el porcentaje acumulado</span>
        </label>
      </div>

      {tieneInputsValidos && resultadoInverso && (
        <div className="cuanto-necesito-resultado" role="region" aria-label="Resultado del cálculo">
          <div
            className={`resultado-inverso ${resultadoInverso.esPosible ? 'posible' : 'imposible'}`}
            role="status"
            aria-live="polite"
          >
            <span className="resultado-icon" aria-hidden="true">
              {resultadoInverso.esPosible ? '✅' : '❌'}
            </span>
            <span className="resultado-mensaje">{resultadoInverso.mensaje}</span>
          </div>

          {resultadoInverso.esPosible && resultadoInverso.notaNecesaria > 10 && (
            <div className="nota-necesaria-display">
              <span className="nota-label">Nota necesaria:</span>
              <span className="nota-valor">{resultadoInverso.notaNecesaria.toFixed(1)}</span>
            </div>
          )}

          <div className="cuanto-necesito-detalles">
            <small>
              📊 Porcentaje acumulado: {resultadoInverso.porcentajeAcumulado.toFixed(1)}% | Restante: {resultadoInverso.porcentajeRestante.toFixed(1)}%
              {!usarPorcentajeManual && ' (estimado con pesos iguales)'}
            </small>
            {resultadoInverso.promedioMaximoAlcanzable > 0 && (
              <small>
                📈 Máximo alcanzable: {resultadoInverso.promedioMaximoAlcanzable.toFixed(1)} (con nota 70 en el restante)
              </small>
            )}
          </div>
        </div>
      )}
    </fieldset>
  );
};
