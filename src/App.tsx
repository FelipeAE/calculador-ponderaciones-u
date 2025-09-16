import { useState, useCallback, useMemo } from 'react';
import { Nota } from './types';
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
    notas.reduce((sum, nota) => sum + nota.porcentaje, 0), 
    [notas]
  );

  const porcentajeDisponible = useMemo(() => 
    modoExamen ? 100 - porcentajeExamen : 100, 
    [modoExamen, porcentajeExamen]
  );

  const promedioActual = useMemo(() => {
    const notasValidas = notas.filter(nota => nota.porcentaje > 0);
    if (notasValidas.length === 0) return 0;
    
    const suma = notasValidas.reduce((acc, nota) => 
      acc + (nota.valor * nota.porcentaje / 100), 0
    );
    
    return suma;
  }, [notas]);

  const promedioFinal = useMemo(() => {
    if (!modoExamen) return promedioActual;

    const porcentajeNotasUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);

    if (porcentajeNotasUsado === 0) {
      return (notaExamen * porcentajeExamen / 100);
    }

    const promedioNotasSinExamen = notas.reduce((acc, nota) =>
      acc + (nota.valor * nota.porcentaje / 100), 0
    );

    const porcentajeRestante = 100 - porcentajeExamen;
    const factorAjuste = porcentajeRestante / porcentajeNotasUsado;

    const promedioNotasAjustado = promedioNotasSinExamen * factorAjuste;
    const promedioExamen = (notaExamen * porcentajeExamen / 100);

    return promedioNotasAjustado + promedioExamen;
  }, [notas, modoExamen, porcentajeExamen, notaExamen]);

  const simuladorAvanzado = useMemo(() => {
    const porcentajeUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
    const porcentajeExamenUsado = modoExamen ? porcentajeExamen : 0;
    const porcentajeDisponibleTotal = 100 - porcentajeUsado - porcentajeExamenUsado;

    if (evaluacionesFuturas === 0 || porcentajeFuturo === 0 || porcentajeFuturo > porcentajeDisponibleTotal) {
      return null;
    }

    const promedioHastaAhora = modoExamen ? promedioFinal : promedioActual;
    const porcentajeAcumulado = porcentajeUsado + porcentajeExamenUsado;

    const notaNecesariaFutura = (notaAprobacion - (promedioHastaAhora * porcentajeAcumulado / 100)) / (porcentajeFuturo / 100);

    const esPosible = notaNecesariaFutura <= 70; // Asumiendo nota máxima 70

    return {
      notaNecesaria: Math.max(0, notaNecesariaFutura),
      esPosible,
      porcentajeDisponible: porcentajeDisponibleTotal
    };
  }, [notas, modoExamen, porcentajeExamen, promedioActual, promedioFinal, evaluacionesFuturas, porcentajeFuturo, notaAprobacion]);

  const calculoRecuperacion = useMemo(() => {
    const porcentajeUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
    const porcentajeExamenUsado = modoExamen ? porcentajeExamen : 0;
    const porcentajeRestante = 100 - porcentajeUsado - porcentajeExamenUsado;

    if (porcentajeRestante <= 0) {
      const promedioFinalActual = modoExamen ? promedioFinal : promedioActual;
      return {
        esPosible: promedioFinalActual >= notaAprobacion,
        mensaje: promedioFinalActual >= notaAprobacion ? "¡Ya tienes la nota para aprobar!" : "No es posible aprobar con las notas actuales",
        notaMinimaNecesaria: 0,
        porcentajeRestante: 0
      };
    }

    const promedioHastaAhora = modoExamen ? promedioFinal : promedioActual;
    const porcentajeAcumulado = porcentajeUsado + porcentajeExamenUsado;

    const notaMinimaNecesaria = (notaAprobacion - (promedioHastaAhora * porcentajeAcumulado / 100)) / (porcentajeRestante / 100);

    const esPosible = notaMinimaNecesaria <= 70; // Asumiendo nota máxima 70

    return {
      esPosible,
      mensaje: esPosible
        ? `Necesitas promedio mínimo de ${Math.max(0, notaMinimaNecesaria).toFixed(1)} en el ${porcentajeRestante}% restante`
        : `Imposible aprobar. Necesitarías ${notaMinimaNecesaria.toFixed(1)} en el ${porcentajeRestante}% restante`,
      notaMinimaNecesaria: Math.max(0, notaMinimaNecesaria),
      porcentajeRestante
    };
  }, [notas, modoExamen, porcentajeExamen, promedioActual, promedioFinal, notaAprobacion]);

  const getValidationState = useCallback((nota: Nota) => {
    if (nota.valor === 0 && nota.porcentaje === 0) return 'neutral';

    const isNotaValid = nota.valor >= 10 && nota.valor <= 70;
    const isPorcentajeValid = nota.porcentaje > 0 && nota.porcentaje <= porcentajeDisponible;

    if (isNotaValid && isPorcentajeValid) return 'valid';
    if (!isNotaValid || !isPorcentajeValid) return 'invalid';

    return 'neutral';
  }, [porcentajeDisponible]);

  const getPorcentajeValidation = useCallback(() => {
    if (porcentajeTotal === 0) return 'neutral';

    const limite = modoExamen ? porcentajeDisponible : 100;

    if (porcentajeTotal === limite) return 'valid';
    if (porcentajeTotal > limite) return 'invalid';
    if (porcentajeTotal < limite && porcentajeTotal > 0) return 'warning';

    return 'neutral';
  }, [porcentajeTotal, modoExamen, porcentajeDisponible]);

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
            const validationState = getValidationState(nota);
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

          <div className={`porcentaje-total validation-${getPorcentajeValidation()}`}>
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
                      {modoExamen && notaAprobacion > 0 ? 
                        (() => {
                          const porcentajeNotasUsado = notas.reduce((sum, nota) => sum + nota.porcentaje, 0);
                          const porcentajeRestante = 100 - porcentajeExamen;
                          
                          if (porcentajeNotasUsado === 0) {
                            return Math.max(0, ((notaAprobacion * 100 / porcentajeExamen))).toFixed(1);
                          }
                          
                          const promedioNotasSinExamen = notas.reduce((acc, nota) => 
                            acc + (nota.valor * nota.porcentaje / 100), 0
                          );
                          
                          const factorAjuste = porcentajeRestante / porcentajeNotasUsado;
                          const promedioNotasAjustado = promedioNotasSinExamen * factorAjuste;
                          
                          const notaNecesaria = (notaAprobacion - promedioNotasAjustado) * 100 / porcentajeExamen;
                          return Math.max(0, notaNecesaria).toFixed(1);
                        })()
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