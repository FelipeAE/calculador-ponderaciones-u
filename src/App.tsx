import { getPorcentajeValidation } from './utils/validations';
import { CalculadorProvider, useCalculador } from './context/CalculadorContext';
import { NotasSection } from './components/NotasSection';
import { ExamenSection } from './components/ExamenSection';
import { SimuladorSection } from './components/SimuladorSection';
import { RecuperacionSection } from './components/RecuperacionSection';
import { ResultadosSection } from './components/ResultadosSection';
import { ThemeSelector } from './components/ThemeSelector';
import './App.css';

/**
 * Componente interno de la aplicación que usa el contexto de la calculadora
 */
function AppContent() {
  const {
    notas,
    porcentajeTotal,
    porcentajeDisponible,
    promedioActual,
    promedioFinal,
    modoExamen,
    porcentajeExamen,
    notaExamen,
    notaAprobacion,
    theme,
    setTheme,
    agregarNota,
    eliminarNota,
    actualizarNota,
    setModoExamen,
    setPorcentajeExamen,
    setNotaExamen,
    setNotaAprobacion,
    evaluacionesFuturas,
    porcentajeFuturo,
    setEvaluacionesFuturas,
    setPorcentajeFuturo,
    notaNecesariaExamen,
    simuladorAvanzado,
    calculoRecuperacion,
    limpiar
  } = useCalculador();

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
          <div className="alerta" role="alert">
            ⚠️ Los porcentajes suman {porcentajeTotal}% pero el máximo es 100%
          </div>
        )}

        {modoExamen && porcentajeTotal > porcentajeDisponible && (
          <div className="alerta" role="alert">
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

/**
 * Componente raíz de la aplicación con proveedor de contexto
 */
function App() {
  return (
    <CalculadorProvider>
      <AppContent />
    </CalculadorProvider>
  );
}

export default App;
