import { getPorcentajeValidation } from './utils/validations';
import { CalculadorProvider, useCalculador } from './context/CalculadorContext';
import { NotasSection } from './components/NotasSection';
import { AprobacionSelector } from './components/AprobacionSelector';
import { ExamenSection } from './components/ExamenSection';
import { SimuladorSection } from './components/SimuladorSection';
import { RecuperacionSection } from './components/RecuperacionSection';
import { ResultadosSection } from './components/ResultadosSection';
import { ThemeSelector } from './components/ThemeSelector';
import { GradeBreakdown } from './components/GradeBreakdown';
import { PercentageBar } from './components/PercentageBar';
import { HelpSection } from './components/HelpSection';
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
    promedioProyectado,
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

  // Calcular porcentaje usado para componentes de visualización
  const notasValidas = notas.filter(nota => nota.valor > 0 && nota.porcentaje > 0);
  const porcentajeUsado = notasValidas.reduce((sum, nota) => sum + nota.porcentaje, 0);

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

        {/* Barra de Porcentajes */}
        <PercentageBar
          porcentajeUsado={porcentajeUsado}
          porcentajeExamen={porcentajeExamen}
          modoExamen={modoExamen}
        />

        {/* Selector de Nota de Aprobación */}
        <AprobacionSelector
          notaAprobacion={notaAprobacion}
          onChangeNotaAprobacion={setNotaAprobacion}
        />

        <div className="controles">
          {/* Sección de Examen */}
          <ExamenSection
            modoExamen={modoExamen}
            porcentajeExamen={porcentajeExamen}
            notaExamen={notaExamen}
            notaNecesariaExamen={notaNecesariaExamen}
            onChangeExamen={setModoExamen}
            onChangePorcentajeExamen={setPorcentajeExamen}
            onChangeNotaExamen={setNotaExamen}
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
          promedioProyectado={promedioProyectado}
          modoExamen={modoExamen}
          notaExamen={notaExamen}
          notaAprobacion={notaAprobacion}
        />

        {/* Desglose de Promedio */}
        <GradeBreakdown
          promedioActual={promedioActual}
          promedioProyectado={promedioProyectado}
          porcentajeUsado={porcentajeUsado}
          modoExamen={modoExamen}
          porcentajeExamen={porcentajeExamen}
        />

        {/* Sección de Ayuda */}
        <HelpSection />
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
