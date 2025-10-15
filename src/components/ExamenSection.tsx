interface ExamenSectionProps {
  modoExamen: boolean;
  porcentajeExamen: number;
  notaExamen: number;
  notaAprobacion: number;
  notaNecesariaExamen: number;
  onChangeExamen: (checked: boolean) => void;
  onChangePorcentajeExamen: (valor: number) => void;
  onChangeNotaExamen: (valor: number) => void;
  onChangeNotaAprobacion: (valor: number) => void;
}

export const ExamenSection = ({
  modoExamen,
  porcentajeExamen,
  notaExamen,
  notaAprobacion,
  notaNecesariaExamen,
  onChangeExamen,
  onChangePorcentajeExamen,
  onChangeNotaExamen,
  onChangeNotaAprobacion
}: ExamenSectionProps) => {
  return (
    <div className="modo-examen">
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={modoExamen}
          onChange={(e) => onChangeExamen(e.target.checked)}
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
                onChange={(e) => onChangeNotaExamen(parseFloat(e.target.value) || 0)}
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
                onChange={(e) => onChangePorcentajeExamen(parseInt(e.target.value) || 30)}
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
                onChange={(e) => onChangeNotaAprobacion(parseFloat(e.target.value) || 40)}
                className="input-aprobacion"
              />
            </div>

            <div className="nota-necesaria">
              <label>Nota que necesitas</label>
              <div className="valor-necesario">
                {modoExamen && notaAprobacion > 0 ? notaNecesariaExamen.toFixed(1) : '0'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
