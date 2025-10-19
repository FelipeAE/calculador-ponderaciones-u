import { Nota } from '../types';

/**
 * Interfaz para los datos exportables
 */
export interface ExportData {
  notas: Nota[];
  promedioActual: number;
  promedioFinal: number;
  modoExamen: boolean;
  porcentajeExamen: number;
  notaExamen: number;
  notaAprobacion: number;
  fecha: string;
}

/**
 * Exporta los datos a formato CSV
 * @param data Datos a exportar
 * @returns String con formato CSV
 */
export const exportToCSV = (data: ExportData): string => {
  const headers = ['Asignatura', 'Nota', 'Porcentaje', 'Contribución'];
  const rows: string[] = [];

  // Encabezados
  rows.push(headers.join(','));

  // Datos de notas
  data.notas.forEach((nota) => {
    if (nota.valor > 0 && nota.porcentaje > 0) {
      const contribucion = (nota.valor * nota.porcentaje) / 100;
      rows.push(
        `"${nota.nombre || 'Sin nombre'}",${nota.valor},${nota.porcentaje}%,${contribucion.toFixed(2)}`
      );
    }
  });

  // Línea en blanco
  rows.push('');

  // Resumen
  rows.push('Resumen,');
  rows.push(`Promedio Actual,${data.promedioActual.toFixed(2)}`);

  if (data.modoExamen) {
    rows.push(`Nota Examen,${data.notaExamen}`);
    rows.push(`Porcentaje Examen,${data.porcentajeExamen}%`);
    rows.push(`Promedio Final,${data.promedioFinal.toFixed(2)}`);
    rows.push(`Nota Aprobación,${data.notaAprobacion}`);
    rows.push(`Estado,${data.promedioFinal >= data.notaAprobacion ? 'Aprobado' : 'Reprobado'}`);
  }

  rows.push(`Fecha de exportación,${data.fecha}`);

  return rows.join('\n');
};

/**
 * Exporta los datos a formato JSON
 * @param data Datos a exportar
 * @returns String con formato JSON
 */
export const exportToJSON = (data: ExportData): string => {
  const exportableData = {
    ...data,
    estado: data.promedioFinal >= data.notaAprobacion ? 'Aprobado' : 'Reprobado'
  };

  return JSON.stringify(exportableData, null, 2);
};

/**
 * Exporta los datos a formato texto legible
 * @param data Datos a exportar
 * @returns String con formato legible
 */
export const exportToText = (data: ExportData): string => {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('REPORTE DE CALIFICACIONES');
  lines.push('='.repeat(60));
  lines.push('');

  lines.push('NOTAS REGISTRADAS:');
  lines.push('-'.repeat(60));

  let index = 1;
  data.notas.forEach((nota) => {
    if (nota.valor > 0 && nota.porcentaje > 0) {
      const contribucion = (nota.valor * nota.porcentaje) / 100;
      lines.push(
        `${index}. ${nota.nombre || 'Sin nombre'}`
      );
      lines.push(`   Nota: ${nota.valor}/70`);
      lines.push(`   Porcentaje: ${nota.porcentaje}%`);
      lines.push(`   Contribución al promedio: ${contribucion.toFixed(2)}`);
      lines.push('');
      index++;
    }
  });

  lines.push('='.repeat(60));
  lines.push('RESULTADOS:');
  lines.push('-'.repeat(60));
  lines.push(`Promedio Actual: ${data.promedioActual.toFixed(2)}`);

  if (data.modoExamen) {
    lines.push('');
    lines.push('INFORMACIÓN DEL EXAMEN:');
    lines.push(`- Porcentaje del Examen: ${data.porcentajeExamen}%`);
    lines.push(`- Nota del Examen: ${data.notaExamen > 0 ? data.notaExamen : 'No ingresada'}`);
    lines.push(`- Nota Requerida para Aprobar: ${data.notaAprobacion}`);
    lines.push('');
    lines.push(`Promedio Final: ${data.promedioFinal.toFixed(2)}`);
    lines.push(
      `Estado: ${data.promedioFinal >= data.notaAprobacion ? '✓ APROBADO' : '✗ REPROBADO'}`
    );
  }

  lines.push('');
  lines.push('='.repeat(60));
  lines.push(`Fecha de Exportación: ${data.fecha}`);
  lines.push('='.repeat(60));

  return lines.join('\n');
};

/**
 * Descarga un archivo con los datos exportados
 * @param content Contenido del archivo
 * @param filename Nombre del archivo
 * @param mimeType Tipo MIME del archivo
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Genera un nombre de archivo con timestamp
 * @param extension Extensión del archivo
 * @returns Nombre del archivo
 */
export const generateFilename = (extension: string): string => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .slice(0, 19)
    .replace(/[-:T]/g, '');

  return `calculadora-ponderaciones-${timestamp}.${extension}`;
};

/**
 * Exporta y descarga los datos en el formato especificado
 * @param data Datos a exportar
 * @param format Formato de exportación ('csv', 'json', 'txt')
 */
export const exportAndDownload = (
  data: ExportData,
  format: 'csv' | 'json' | 'txt' = 'txt'
): void => {
  let content: string;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case 'csv':
      content = exportToCSV(data);
      filename = generateFilename('csv');
      mimeType = 'text/csv';
      break;
    case 'json':
      content = exportToJSON(data);
      filename = generateFilename('json');
      mimeType = 'application/json';
      break;
    case 'txt':
    default:
      content = exportToText(data);
      filename = generateFilename('txt');
      mimeType = 'text/plain';
      break;
  }

  downloadFile(content, filename, mimeType);
};
