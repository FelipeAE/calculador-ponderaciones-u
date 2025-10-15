interface ResultadosSectionProps {
  promedioActual: number;
  promedioFinal: number;
  modoExamen: boolean;
  notaExamen: number;
  notaAprobacion: number;
}

export const ResultadosSection = ({
  promedioActual,
  promedioFinal,
  modoExamen,
  notaExamen,
  notaAprobacion
}: ResultadosSectionProps) => {
  return (
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
  );
};
