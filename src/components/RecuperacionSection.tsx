interface RecuperacionResult {
  esPosible: boolean;
  mensaje: string;
  notaMinimaNecesaria: number;
  porcentajeRestante: number;
}

interface RecuperacionSectionProps {
  calculoRecuperacion: RecuperacionResult;
}

export const RecuperacionSection = ({ calculoRecuperacion }: RecuperacionSectionProps) => {
  return (
    <div className="recuperacion-section">
      <h3>Análisis de Recuperación</h3>
      <div className="recuperacion-descripcion">
        <p>🔍 <strong>Análisis automático:</strong> Calcula si puedes aprobar usando TODO el porcentaje restante.</p>
      </div>
      <div className={`recuperacion-resultado ${calculoRecuperacion.esPosible ? 'posible' : 'imposible'}`}>
        {calculoRecuperacion.esPosible ? '✅' : '❌'} {calculoRecuperacion.mensaje}
      </div>
    </div>
  );
};
