import React, { useCallback, useMemo } from 'react';
import { Nota } from '../types';
import { exportAndDownload, ExportData } from '../utils/exportData';

/**
 * Props del componente de exportación
 */
interface ExportSectionProps {
  notas: Nota[];
  promedioActual: number;
  promedioFinal: number;
  modoExamen: boolean;
  porcentajeExamen: number;
  notaExamen: number;
  notaAprobacion: number;
}

/**
 * Componente para exportar datos en diferentes formatos
 * Permite descargar los resultados de la calculadora en CSV, JSON o TXT
 */
export const ExportSection: React.FC<ExportSectionProps> = ({
  notas,
  promedioActual,
  promedioFinal,
  modoExamen,
  porcentajeExamen,
  notaExamen,
  notaAprobacion
}) => {
  // Preparar datos para exportación
  const exportData = useMemo<ExportData>(() => ({
    notas,
    promedioActual,
    promedioFinal,
    modoExamen,
    porcentajeExamen,
    notaExamen,
    notaAprobacion,
    fecha: new Date().toLocaleString('es-ES')
  }), [notas, promedioActual, promedioFinal, modoExamen, porcentajeExamen, notaExamen, notaAprobacion]);

  // Manejadores de exportación
  const handleExportCSV = useCallback(() => {
    exportAndDownload(exportData, 'csv');
  }, [exportData]);

  const handleExportJSON = useCallback(() => {
    exportAndDownload(exportData, 'json');
  }, [exportData]);

  const handleExportTXT = useCallback(() => {
    exportAndDownload(exportData, 'txt');
  }, [exportData]);

  // Verificar si hay datos válidos para exportar
  const hasValidData = useMemo(() => {
    return notas.some(nota => nota.valor > 0 && nota.porcentaje > 0);
  }, [notas]);

  return (
    <section className="export-section" aria-label="Exportar resultados">
      <div className="export-header">
        <h3 id="export-title">📥 Exportar Resultados</h3>
        <p>Descarga tus cálculos en el formato que prefieras</p>
      </div>

      {!hasValidData && (
        <div
          className="export-warning"
          role="alert"
          aria-label="Advertencia: no hay datos para exportar"
        >
          ⚠️ Ingresa al menos una nota para exportar
        </div>
      )}

      <div
        className="export-buttons"
        role="group"
        aria-labelledby="export-title"
      >
        <button
          onClick={handleExportCSV}
          disabled={!hasValidData}
          className="btn-export btn-export-csv"
          aria-label="Exportar como archivo CSV (hojas de cálculo)"
          title="Descarga un archivo CSV compatible con Excel"
        >
          📊 CSV
        </button>

        <button
          onClick={handleExportJSON}
          disabled={!hasValidData}
          className="btn-export btn-export-json"
          aria-label="Exportar como archivo JSON (datos estructurados)"
          title="Descarga un archivo JSON con todos los datos"
        >
          {} JSON
        </button>

        <button
          onClick={handleExportTXT}
          disabled={!hasValidData}
          className="btn-export btn-export-txt"
          aria-label="Exportar como archivo de texto"
          title="Descarga un archivo TXT legible"
        >
          📄 TXT
        </button>
      </div>

      <div className="export-info">
        <small id="export-info-text">
          Cada formato mantiene toda la información de tus cálculos
        </small>
      </div>
    </section>
  );
};
