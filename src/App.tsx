import { useState, useCallback, useMemo } from 'react';
import { Nota } from './types';
import {
  calcularPromedioActual,
  calcularPromedioFinal,
  calcularNotaNecesariaExamen,
  calcularSimuladorAvanzado,
  calcularRecuperacion,
  calcularPorcentajeTotal,
  calcularPorcentajeDisponible
} from './utils/calculations';
import { getValidationState, getPorcentajeValidation } from './utils/validations';
import './App.css';

function App() {
  const [notas, setNotas] = useState<Nota[]>([
    { id: '1', nombre: '', valor: 0, porcentaje: 0 },
    { id: '2', nombre: '', valor: 0, porcentaje: 0 },
    { id: '3', nombre: '', valor: 0, porcentaje: 0 }
  ]);
  const [modoExamen, setModoExamen] = useState(false);
  const [porcentajeExamen, setPorcentajeExamen] = useState(30);
  const [notaExamen, setNotaExamen] = useState(0);
  const [notaAprobacion, setNotaAprobacion] = useState(40);
  const [evaluacionesFuturas, setEvaluacionesFuturas] = useState(0);
  const [porcentajeFuturo, setPorcentajeFuturo] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const porcentajeTotal = useMemo(() =>
    calcularPorcentajeTotal(notas),
    [notas]
  );

  const porcentajeDisponible = useMemo(() =>
    calcularPorcentajeDisponible(modoExamen, porcentajeExamen),
    [modoExamen, porcentajeExamen]
  );

  const promedioActual = useMemo(() =>
    calcularPromedioActual(notas),
    [notas]
  );

  const promedioFinal = useMemo(() =>
    modoExamen
      ? calcularPromedioFinal(notas, porcentajeExamen, notaExamen)
      : promedioActual,
    [notas, modoExamen, porcentajeExamen, notaExamen, promedioActual]
  );

  const simuladorAvanzado = useMemo(() =>
    calcularSimuladorAvanzado(
      notas,
      modoExamen,
      porcentajeExamen,
      evaluacionesFuturas,
      porcentajeFuturo,
      notaAprobacion,
      promedioActual,
      promedioFinal
    ),
    [notas, modoExamen, porcentajeExamen, evaluacionesFuturas, porcentajeFuturo, notaAprobacion, promedioActual, promedioFinal]
  );

  const calculoRecuperacion = useMemo(() =>
    calcularRecuperacion(
      notas,
      modoExamen,
      porcentajeExamen,
      promedioActual,
      promedioFinal,
      notaAprobacion
    ),
    [notas, modoExamen, porcentajeExamen, promedioActual, promedioFinal, notaAprobacion]
  );

  const notaNecesariaExamen = useMemo(() =>
    calcularNotaNecesariaExamen(notas, porcentajeExamen, notaAprobacion),
    [notas, porcentajeExamen, notaAprobacion]
  );

  const agregarNota = useCallback(() => {
    const nuevaNota: Nota = {
      id: Date.now().toString(),
      nombre: '',
      valor: 0,
      porcentaje: 0
    };
    setNotas(prev => [...prev, nuevaNota]);
  }, []);

  const eliminarNota = useCallback((id: string) => {
    setNotas(prev => prev.filter(nota => nota.id !== id));
  }, []);

  const actualizarNota = useCallback((id: string, campo: keyof Nota, valor: string | number) => {
    setNotas(prev => prev.map(nota => 
      nota.id === id ? { ...nota, [campo]: valor } : nota
    ));
  }, []);

  const limpiar = useCallback(() => {
    setNotas([
      { id: '1', nombre: '', valor: 0, porcentaje: 0 },
      { id: '2', nombre: '', valor: 0, porcentaje: 0 },
      { id: '3', nombre: '', valor: 0, porcentaje: 0 }
    ]);
    setModoExamen(false);
    setPorcentajeExamen(30);
    setNotaExamen(0);
    setNotaAprobacion(40);
    setEvaluacionesFuturas(0);
    setPorcentajeFuturo(0);
  }, []);


  return (
    <div className={`calculadora ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Calculadora de Ponderaciones</h1>
            <p>Calcula tu promedio ponderado de notas</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="dark-mode-toggle"
            aria-label="Cambiar tema"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="container">
        <div className="ejemplo-section">
          <div className="ejemplo-titulo">Ejemplo de formato:</div>
          <div className="ejemplo-row">
            <div className="ejemplo-input">65</div>
            <div className="ejemplo-input">25</div>
            <div className="ejemplo-label">%</div>
          </div>
        </div>

        <div className="notas-section">
          {notas.map((nota) => {
            const validationState = getValidationState(nota, porcentajeDisponible);
            return (
              <div key={nota.id} className="nota-row">
                <input
                  type="number"
                  placeholder="Nota"
                  min="10"
                  max="70"
                  step="0.1"
                  value={nota.valor || ''}
                  onChange={(e) => actualizarNota(nota.id, 'valor', parseFloat(e.target.value) || 0)}
                  className={`input-nota validation-${validationState}`}
                />

                <input
                  type="number"
                  placeholder="Porcentaje"
                  min="0"
                  max="100"
                  step="1"
                  value={nota.porcentaje || ''}
                  onChange={(e) => actualizarNota(nota.id, 'porcentaje', parseInt(e.target.value) || 0)}
                  className={`input-porcentaje validation-${validationState}`}
                />

                {notas.length > 3 && (
                  <button
                    onClick={() => eliminarNota(nota.id)}
                    className="btn-eliminar"
                    aria-label="Eliminar nota"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          <button onClick={agregarNota} className="btn-agregar">
            + Agregar Nota
          </button>

          <div className={`porcentaje-total validation-${getPorcentajeValidation(porcentajeTotal, modoExamen, porcentajeDisponible)}`}>
            <span>Total: {porcentajeTotal}%</span>
            {modoExamen && <span> (Disponible: {porcentajeDisponible}%)</span>}
          </div>
        </div>

        <div className="controles">
          <div className="modo-examen">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={modoExamen}
                onChange={(e) => setModoExamen(e.target.checked)}
              />
              <span className="checkmark"></span>
              Dar Examen
            </label>
            
            {modoExamen && (
              <div className="examen-section">
                <div className="examen-inputs">
                  <div className="input-group">
                    <label>Nota Examen</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={notaExamen || ''}
                      onChange={(e) => setNotaExamen(parseFloat(e.target.value) || 0)}
                      className="input-examen-nota"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>% Examen</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={porcentajeExamen}
                      onChange={(e) => setPorcentajeExamen(parseInt(e.target.value) || 30)}
                      className="input-examen-porcentaje"
                    />
                  </div>
                </div>
                
                <div className="examen-info">
                  <div className="input-group">
                    <label>Nota aprobación</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={notaAprobacion}
                      onChange={(e) => setNotaAprobacion(parseFloat(e.target.value) || 40)}
                      className="input-aprobacion"
                    />
                  </div>
                  
                  <div className="nota-necesaria">
                    <label>Nota que necesitas</label>
                    <div className="valor-necesario">
                      {modoExamen && notaAprobacion > 0
                        ? notaNecesariaExamen.toFixed(1)
                        : '0'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                  onChange={(e) => setEvaluacionesFuturas(parseInt(e.target.value) || 0)}
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
                  onChange={(e) => setPorcentajeFuturo(parseInt(e.target.value) || 0)}
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

          <div className="recuperacion-section">
            <h3>Análisis de Recuperación</h3>
            <div className="recuperacion-descripcion">
              <p>🔍 <strong>Análisis automático:</strong> Calcula si puedes aprobar usando TODO el porcentaje restante.</p>
            </div>
            <div className={`recuperacion-resultado ${calculoRecuperacion.esPosible ? 'posible' : 'imposible'}`}>
              {calculoRecuperacion.esPosible ? '✅' : '❌'} {calculoRecuperacion.mensaje}
            </div>
          </div>

          <button onClick={limpiar} className="btn-limpiar">
            Limpiar
          </button>
        </div>

        {!modoExamen && porcentajeTotal > 100 && (
          <div className="alerta">
            ⚠️ Los porcentajes suman {porcentajeTotal}% pero el máximo es 100%
          </div>
        )}
        
        {modoExamen && porcentajeTotal > porcentajeDisponible && (
          <div className="alerta">
            ⚠️ Los porcentajes suman {porcentajeTotal}% pero el máximo disponible es {porcentajeDisponible}% (el examen vale {porcentajeExamen}%)
          </div>
        )}

        <div className="resultados">
          <div className="resultado">
            <h3>Promedio Actual</h3>
            <div className="valor">{promedioActual.toFixed(2)}</div>
          </div>
          
          {modoExamen && (
            <div className="resultado">
              <h3>Promedio Final (con examen)</h3>
              <div className="valor">{promedioFinal.toFixed(2)}</div>
              {notaExamen > 0 && (
                <small>
                  {promedioFinal >= notaAprobacion 
                    ? `¡Aprobado! Nota final: ${promedioFinal.toFixed(1)}`
                    : `Reprobado. Nota final: ${promedioFinal.toFixed(1)}`
                  }
                </small>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;