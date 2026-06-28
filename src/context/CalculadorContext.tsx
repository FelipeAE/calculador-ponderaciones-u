import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { Nota, ResultadoInverso } from '../types';
import { Theme } from '../types/theme';
import {
  calcularPromedioActual,
  calcularPromedioFinal,
  calcularNotaNecesariaExamen,
  calcularSimuladorAvanzado,
  calcularRecuperacion,
  calcularPromedioProyectado,
  calcularPorcentajeTotal,
  calcularPorcentajeDisponible,
  calcularNotaNecesariaInversa
} from '../utils/calculations';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Interfaz para el contexto de la calculadora
 */
interface CalculadorContextType {
  // Estado de Notas
  notas: Nota[];
  agregarNota: () => void;
  eliminarNota: (id: string) => void;
  actualizarNota: (id: string, campo: keyof Nota, valor: string | number) => void;

  // Estado de Examen
  modoExamen: boolean;
  porcentajeExamen: number;
  notaExamen: number;
  setModoExamen: (valor: boolean) => void;
  setPorcentajeExamen: (valor: number) => void;
  setNotaExamen: (valor: number) => void;

  // Estado de Aprobación
  notaAprobacion: number;
  setNotaAprobacion: (valor: number) => void;

  // Estado de Simulador
  evaluacionesFuturas: number;
  porcentajeFuturo: number;
  setEvaluacionesFuturas: (valor: number) => void;
  setPorcentajeFuturo: (valor: number) => void;

  // Estado de ¿Cuánto Necesito? (Calculadora Inversa)
  promedioActualInverso: number;
  notasRendidas: number;
  totalNotasRamo: number;
  promedioObjetivoInverso: number;
  porcentajeManualInverso: number | null;
  setPromedioActualInverso: (valor: number) => void;
  setNotasRendidas: (valor: number) => void;
  setTotalNotasRamo: (valor: number) => void;
  setPromedioObjetivoInverso: (valor: number) => void;
  setPorcentajeManualInverso: (valor: number | null) => void;

  // Estado de Tema
  theme: Theme;
  setTheme: (tema: Theme) => void;

  // Cálculos Memoizados
  porcentajeTotal: number;
  porcentajeDisponible: number;
  promedioActual: number;
  promedioFinal: number;
  promedioProyectado: ReturnType<typeof calcularPromedioProyectado>;
  notaNecesariaExamen: number;
  simuladorAvanzado: ReturnType<typeof calcularSimuladorAvanzado>;
  calculoRecuperacion: ReturnType<typeof calcularRecuperacion>;
  resultadoInverso: ResultadoInverso | null;

  // Utilidades
  limpiar: () => void;
}

/**
 * Crear el contexto de la calculadora
 */
const CalculadorContext = createContext<CalculadorContextType | undefined>(undefined);

/**
 * Props del proveedor del contexto
 */
interface CalculadorProviderProps {
  children: ReactNode;
}

/**
 * Proveedor del contexto de la calculadora
 */
export const CalculadorProvider: React.FC<CalculadorProviderProps> = ({ children }) => {
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

  // Estado de ¿Cuánto Necesito?
  const [promedioActualInverso, setPromedioActualInverso] = useLocalStorage('calc_promedioActualInverso', 0);
  const [notasRendidas, setNotasRendidas] = useLocalStorage('calc_notasRendidas', 3);
  const [totalNotasRamo, setTotalNotasRamo] = useLocalStorage('calc_totalNotasRamo', 4);
  const [promedioObjetivoInverso, setPromedioObjetivoInverso] = useLocalStorage('calc_promedioObjetivoInverso', 0);
  const [porcentajeManualInverso, setPorcentajeManualInverso] = useLocalStorage<number | null>('calc_porcentajeManualInverso', null);

  // Callbacks memoizados
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
    setPromedioActualInverso(0);
    setNotasRendidas(3);
    setTotalNotasRamo(4);
    setPromedioObjetivoInverso(0);
    setPorcentajeManualInverso(null);
  }, [setNotas, setModoExamen, setPorcentajeExamen, setNotaExamen, setNotaAprobacion, setEvaluacionesFuturas, setPorcentajeFuturo, setPromedioActualInverso, setNotasRendidas, setTotalNotasRamo, setPromedioObjetivoInverso, setPorcentajeManualInverso]);

  // Cálculos memoizados
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

  const promedioProyectado = useMemo(() =>
    calcularPromedioProyectado(notas, modoExamen, porcentajeExamen, promedioActual),
    [notas, modoExamen, porcentajeExamen, promedioActual]
  );

  const notaNecesariaExamen = useMemo(() =>
    calcularNotaNecesariaExamen(notas, porcentajeExamen, notaAprobacion),
    [notas, porcentajeExamen, notaAprobacion]
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

  const resultadoInverso = useMemo(() => {
    if (promedioActualInverso <= 0 || totalNotasRamo <= 0 || promedioObjetivoInverso <= 0) {
      return null;
    }
    return calcularNotaNecesariaInversa(
      promedioActualInverso,
      notasRendidas,
      totalNotasRamo,
      promedioObjetivoInverso,
      porcentajeManualInverso
    );
  }, [promedioActualInverso, notasRendidas, totalNotasRamo, promedioObjetivoInverso, porcentajeManualInverso]);

  const value: CalculadorContextType = {
    notas,
    agregarNota,
    eliminarNota,
    actualizarNota,
    modoExamen,
    porcentajeExamen,
    notaExamen,
    setModoExamen,
    setPorcentajeExamen,
    setNotaExamen,
    notaAprobacion,
    setNotaAprobacion,
    evaluacionesFuturas,
    porcentajeFuturo,
    setEvaluacionesFuturas,
    setPorcentajeFuturo,
    promedioActualInverso,
    notasRendidas,
    totalNotasRamo,
    promedioObjetivoInverso,
    porcentajeManualInverso,
    setPromedioActualInverso,
    setNotasRendidas,
    setTotalNotasRamo,
    setPromedioObjetivoInverso,
    setPorcentajeManualInverso,
    theme,
    setTheme,
    porcentajeTotal,
    porcentajeDisponible,
    promedioActual,
    promedioFinal,
    promedioProyectado,
    notaNecesariaExamen,
    simuladorAvanzado,
    calculoRecuperacion,
    resultadoInverso,
    limpiar
  };

  return (
    <CalculadorContext.Provider value={value}>
      {children}
    </CalculadorContext.Provider>
  );
};

/**
 * Hook para usar el contexto de la calculadora
 * @throws Error si se usa fuera del CalculadorProvider
 */
export const useCalculador = (): CalculadorContextType => {
  const context = useContext(CalculadorContext);
  if (!context) {
    throw new Error('useCalculador debe ser usado dentro de CalculadorProvider');
  }
  return context;
};
