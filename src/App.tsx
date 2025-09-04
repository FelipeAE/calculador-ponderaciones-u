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
  }, []);


  return (
    <div className="calculadora">
      <div className="header">
        <h1>Calculadora de Ponderaciones</h1>
        <p>Calcula tu promedio ponderado de notas</p>
      </div>

      <div className="container">
        <div className="notas-section">
          {notas.map((nota) => (
            <div key={nota.id} className="nota-row">
              <input
                type="number"
                placeholder="Nota"
                min="1"
                max="7"
                step="0.1"
                value={nota.valor || ''}
                onChange={(e) => actualizarNota(nota.id, 'valor', parseFloat(e.target.value) || 0)}
                className="input-nota"
              />
              
              <input
                type="number"
                placeholder="Porcentaje"
                min="0"
                max="100"
                step="1"
                value={nota.porcentaje || ''}
                onChange={(e) => actualizarNota(nota.id, 'porcentaje', parseInt(e.target.value) || 0)}
                className="input-porcentaje"
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
          ))}

          <button onClick={agregarNota} className="btn-agregar">
            + Agregar Nota
          </button>
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