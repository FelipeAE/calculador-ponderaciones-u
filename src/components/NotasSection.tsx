import { useCallback } from 'react';
import { Nota } from '../types';
import { NotaInput } from './NotaInput';

/**
 * Props de la sección de notas
 */
interface NotasSectionProps {
  notas: Nota[];
  porcentajeDisponible: number;
  onActualizarNota: (id: string, campo: keyof Nota, valor: string | number) => void;
  onEliminarNota: (id: string) => void;
  onAgregarNota: () => void;
  porcentajeTotal: number;
  getPorcentajeValidation: (total: number, modo: boolean, disponible: number) => string;
  modoExamen: boolean;
}

/**
 * Componente que gestiona la sección de notas
 * Utiliza el componente NotaInput para cada nota individual
 */
export const NotasSection = ({
  notas,
  porcentajeDisponible,
  onActualizarNota,
  onEliminarNota,
  onAgregarNota,
  porcentajeTotal,
  getPorcentajeValidation,
  modoExamen
}: NotasSectionProps) => {
  // Callbacks memoizados para evitar re-renders innecesarios
  const handleChangeValor = useCallback((id: string, valor: number) => {
    onActualizarNota(id, 'valor', valor);
  }, [onActualizarNota]);

  const handleChangePorcentaje = useCallback((id: string, porcentaje: number) => {
    onActualizarNota(id, 'porcentaje', porcentaje);
  }, [onActualizarNota]);

  const handleEliminar = useCallback((id: string) => {
    onEliminarNota(id);
  }, [onEliminarNota]);

  return (
    <div className="notas-section">
      {/* Sección de ejemplo/formato */}
      <div className="ejemplo-section">
        <div className="ejemplo-titulo">Ejemplo de formato:</div>
        <div className="ejemplo-row">
          <div className="ejemplo-input">65</div>
          <div className="ejemplo-input">25</div>
          <div className="ejemplo-label">%</div>
        </div>
      </div>

      {/* Lista de notas */}
      <div className="notas-list" role="group" aria-label="Lista de notas">
        {notas.map((nota) => (
          <NotaInput
            key={nota.id}
            nota={nota}
            porcentajeDisponible={porcentajeDisponible}
            onChangeValor={(valor) => handleChangeValor(nota.id, valor)}
            onChangePorcentaje={(porcentaje) => handleChangePorcentaje(nota.id, porcentaje)}
            onEliminar={() => handleEliminar(nota.id)}
            puedeEliminar={notas.length > 3}
          />
        ))}
      </div>

      {/* Botón agregar nota */}
      <button
        onClick={onAgregarNota}
        className="btn-agregar"
        aria-label="Agregar una nueva nota"
      >
        + Agregar Nota
      </button>

      {/* Información total de porcentaje */}
      <div
        className={`porcentaje-total validation-${getPorcentajeValidation(porcentajeTotal, modoExamen, porcentajeDisponible)}`}
        role="status"
        aria-label={`Porcentaje total: ${porcentajeTotal}%`}
      >
        <span>Total: {porcentajeTotal}%</span>
        {modoExamen && <span aria-label={`Disponible: ${porcentajeDisponible}%`}> (Disponible: {porcentajeDisponible}%)</span>}
      </div>
    </div>
  );
};
