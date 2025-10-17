import { useCallback, useMemo } from 'react';
import { Nota } from './types';
import { Theme } from './types/theme';
import {
  calcularPromedioActual,
  calcularPromedioFinal,
  calcularNotaNecesariaExamen,
  calcularSimuladorAvanzado,
  calcularRecuperacion,
  calcularPorcentajeTotal,
  calcularPorcentajeDisponible
} from './utils/calculations';
import { getPorcentajeValidation } from './utils/validations';
import { useLocalStorage } from './hooks/useLocalStorage';
import { NotasSection } from './components/NotasSection';
import { ExamenSection } from './components/ExamenSection';
import { SimuladorSection } from './components/SimuladorSection';
import { RecuperacionSection } from './components/RecuperacionSection';
import { ResultadosSection } from './components/ResultadosSection';
import { ThemeSelector } from './components/ThemeSelector';
import './App.css';

function App() {
  // Estado con persistencia en localStorage
  const [notas, setNotas] = useLocalStorage<Nota[]>('calc_notas', [
    { id: '1', nombre: '', valor: 0, porcentaje: 0 },
    { id: '2', nombre: '', valor: 0, porcentaje: 0 },
    { id: '3', nombre: '', valor: 0, porcentaje: 0 }
  ]);

  const [modoExamen, setModoExamen] = useLocalStorage('calc_modoExamen', false);
  const [porcentajeExamen, setPorcentajeExamen] = useLocalStorage('calc_porcentajeExamen', 30);
  const [notaExamen, setNotaExamen] = useLocalStorage('calc_notaExamen', 0);
  const [notaAprobacion, setNotaAprobacion] = useLocalStorage('calc_notaAprobacion', 40);
  const [evaluacionesFuturas, setEvaluacionesFuturas] = useLocalStorage('calc_evaluacionesFuturas', 0);
  const [porcentajeFuturo, setPorcentajeFuturo] = useLocalStorage('calc_porcentajeFuturo', 0);
  const [theme, setTheme] = useLocalStorage<Theme>('calc_theme', 'light');

  // Cálculos memoizados para optimización de performance
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

  // Callbacks memoizados para evitar re-renders innecesarios
  const agregarNota = useCallback(() => {
    const nuevaNota: Nota = {
      id: Date.now().toString(),
      nombre: '',
      valor: 0,
      porcentaje: 0
    };
    setNotas(prev => [...prev, nuevaNota]);
  }, [setNotas]);

  const eliminarNota = useCallback((id: string) => {
    setNotas(prev => prev.filter(nota => nota.id !== id));
  }, [setNotas]);

  const actualizarNota = useCallback((id: string, campo: keyof Nota, valor: string | number) => {
    setNotas(prev => prev.map(nota =>
      nota.id === id ? { ...nota, [campo]: valor } : nota
    ));
  }, [setNotas]);

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
  }, [setNotas, setModoExamen, setPorcentajeExamen, setNotaExamen, setNotaAprobacion, setEvaluacionesFuturas, setPorcentajeFuturo]);

  return (
    <div className={`calculadora theme-${theme}`}>
      <div className="header">
        <div className="header-content">
          <div>
            <h1>Calculadora de Ponderaciones</h1>
            <p>Calcula tu promedio ponderado de notas</p>
          </div>
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
        </div>
      </div>

      <div className="container">
        {/* Sección de Notas */}
        <NotasSection
          notas={notas}
          porcentajeDisponible={porcentajeDisponible}
          onActualizarNota={actualizarNota}
          onEliminarNota={eliminarNota}
          onAgregarNota={agregarNota}
          porcentajeTotal={porcentajeTotal}
          getPorcentajeValidation={getPorcentajeValidation}
          modoExamen={modoExamen}
        />

        <div className="controles">
          {/* Sección de Examen */}
          <ExamenSection
            modoExamen={modoExamen}
            porcentajeExamen={porcentajeExamen}
            notaExamen={notaExamen}
            notaAprobacion={notaAprobacion}
            notaNecesariaExamen={notaNecesariaExamen}
            onChangeExamen={setModoExamen}
            onChangePorcentajeExamen={setPorcentajeExamen}
            onChangeNotaExamen={setNotaExamen}
            onChangeNotaAprobacion={setNotaAprobacion}
          />

          {/* Sección Simulador */}
          <SimuladorSection
            evaluacionesFuturas={evaluacionesFuturas}
            porcentajeFuturo={porcentajeFuturo}
            simuladorAvanzado={simuladorAvanzado}
            onChangeEvaluacionesFuturas={setEvaluacionesFuturas}
            onChangePorcentajeFuturo={setPorcentajeFuturo}
          />

          {/* Sección Recuperación */}
          <RecuperacionSection calculoRecuperacion={calculoRecuperacion} />

          <button onClick={limpiar} className="btn-limpiar">
            Limpiar
          </button>
        </div>

        {/* Alertas */}
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

        {/* Sección Resultados */}
        <ResultadosSection
          promedioActual={promedioActual}
          promedioFinal={promedioFinal}
          modoExamen={modoExamen}
          notaExamen={notaExamen}
          notaAprobacion={notaAprobacion}
        />
      </div>
    </div>
  );
}

export default App;
