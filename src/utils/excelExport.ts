import ExcelJS from 'exceljs';
import { LPARecord } from '../types/lpa';

/**
 * Genera un archivo Excel (.xlsx) con el formato y estilo exacto
 * requerido para la hoja "4. Base de datos encuesta" según la norma LPA E-FSIG 023.
 */
export async function generateLPAExcel(records: LPARecord[]): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Extractor LPA - E-FSIG 023';
  workbook.lastModifiedBy = 'Google AI Studio LPA Extractor';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('4. Base de datos encuesta', {
    views: [{ showGridLines: true }],
  });

  // Configuración inicial de columnas según especificación
  worksheet.columns = [
    { header: 'N°', key: 'no', width: 8 },
    { header: 'FECHA', key: 'fecha', width: 14 },
    { header: 'AÑO', key: 'ano', width: 10 },
    { header: 'MES', key: 'mes', width: 14 },
    { header: 'PROCESS', key: 'process', width: 22 },
    { header: 'ÁREA', key: 'area', width: 24 },
    { header: 'AUDITOR', key: 'auditor', width: 22 },
    { header: 'AUDITADO', key: 'auditado', width: 24 },
    { header: 'PARAMETER', key: 'parameter', width: 45 },
    { header: 'CUMPLE\n(+2)', key: 'cumple', width: 14 },
    { header: 'NO CUMPLE (CORRIGE DE INMEDIATO)\n(+1)', key: 'no_cumple_inmediato', width: 18 },
    { header: 'NO CUMPLE\n(0)', key: 'no_cumple', width: 14 },
    { header: 'N/A\n(0)', key: 'na', width: 12 },
    { header: 'Commentario auditor LPA', key: 'comentario_auditor', width: 24 },
    { header: 'ACCIÓN A TOMAR', key: 'accion_a_tomar', width: 22 },
    { header: 'RESPONSABLE', key: 'responsable', width: 18 },
    { header: 'FECHA2', key: 'fecha2', width: 14 },
    { header: 'COMENTARIO', key: 'comentario', width: 24 },
  ];

  // Formato del encabezado (Fila 1)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 32;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F497D' }, // Azul marino corporativo (#1F497D)
    };
    cell.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
      color: { argb: 'FFFFFFFF' }, // Blanco
    };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF102A4A' } },
      left: { style: 'thin', color: { argb: 'FF102A4A' } },
      bottom: { style: 'thin', color: { argb: 'FF102A4A' } },
      right: { style: 'thin', color: { argb: 'FF102A4A' } },
    };
  });

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
    right: { style: 'thin', color: { argb: 'FFD9D9D9' } },
  };

  // Agregar filas de datos con bordes y alineaciones
  records.forEach((rec, index) => {
    const row = worksheet.addRow({
      no: rec.no || index + 1,
      fecha: rec.fecha || '',
      ano: rec.ano || new Date().getFullYear(),
      mes: rec.mes || '',
      process: rec.process || '',
      area: rec.area || '',
      auditor: rec.auditor || '',
      auditado: rec.auditado || '',
      parameter: rec.parameter || '',
      cumple: rec.cumple || '',
      no_cumple_inmediato: rec.no_cumple_inmediato || '',
      no_cumple: rec.no_cumple || '',
      na: rec.na || '',
      comentario_auditor: rec.comentario_auditor || '',
      accion_a_tomar: rec.accion_a_tomar || '',
      responsable: rec.responsable || '',
      fecha2: rec.fecha2 || '',
      comentario: rec.comentario || '',
    });

    row.height = 20;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10 };
      cell.border = thinBorder;

      // Columnas centradas según código original (1, 2, 3, 4, 10, 11, 12, 13)
      if ([1, 2, 3, 4, 10, 11, 12, 13].includes(colNumber)) {
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      } else {
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true,
        };
      }

      // Resaltado sutil en caso de marcas 'X' en No Cumple para alertar visualmente
      if (colNumber === 11 && cell.value === 'X') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF3CD' }, // Ambar claro
        };
      } else if (colNumber === 12 && cell.value === 'X') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8D7DA' }, // Rojo suave
        };
      } else if (colNumber === 10 && cell.value === 'X') {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8F5E9' }, // Verde suave
        };
      }
    });
  });

  // Ajuste dinámico de anchos: min(max(max_len + 3, 12), 40)
  worksheet.columns.forEach((column) => {
    let maxLen = 0;
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      const val = cell.value ? String(cell.value) : '';
      const lines = val.split('\n');
      const longestLine = Math.max(...lines.map((l) => l.length));
      if (longestLine > maxLen) maxLen = longestLine;
    });
    const colWidth = Math.min(Math.max(maxLen + 3, 12), 40);
    column.width = colWidth;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/**
 * Descarga el blob como archivo .xlsx en el navegador
 */
export function downloadExcelBlob(blob: Blob, filename = 'auditoria_lpa_datos.xlsx') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Convierte los registros a formato TSV para copiar al portapapeles y pegar en Excel
 */
export function recordsToTSV(records: LPARecord[]): string {
  const headers = [
    "N°",
    "FECHA",
    "AÑO",
    "MES",
    "PROCESS",
    "ÁREA",
    "AUDITOR",
    "AUDITADO",
    "PARAMETER",
    "CUMPLE (+2)",
    "NO CUMPLE (CORRIGE DE INMEDIATO) (+1)",
    "NO CUMPLE (0)",
    "N/A (0)",
    "Commentario auditor LPA",
    "ACCIÓN A TOMAR",
    "RESPONSABLE",
    "FECHA2",
    "COMENTARIO",
  ];

  const rows = records.map((r, i) => [
    r.no || i + 1,
    r.fecha || '',
    r.ano || '',
    r.mes || '',
    r.process || '',
    r.area || '',
    r.auditor || '',
    r.auditado || '',
    r.parameter || '',
    r.cumple || '',
    r.no_cumple_inmediato || '',
    r.no_cumple || '',
    r.na || '',
    r.comentario_auditor || '',
    r.accion_a_tomar || '',
    r.responsable || '',
    r.fecha2 || '',
    r.comentario || '',
  ]);

  return [headers.join('\t'), ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join('\t'))].join('\n');
}

/**
 * Convierte los registros a CSV estándar
 */
export function recordsToCSV(records: LPARecord[]): string {
  const headers = [
    "N°",
    "FECHA",
    "AÑO",
    "MES",
    "PROCESS",
    "ÁREA",
    "AUDITOR",
    "AUDITADO",
    "PARAMETER",
    "CUMPLE (+2)",
    "NO CUMPLE (CORRIGE DE INMEDIATO) (+1)",
    "NO CUMPLE (0)",
    "N/A (0)",
    "Commentario auditor LPA",
    "ACCIÓN A TOMAR",
    "RESPONSABLE",
    "FECHA2",
    "COMENTARIO",
  ];

  const rows = records.map((r, i) => [
    r.no || i + 1,
    r.fecha || '',
    r.ano || '',
    r.mes || '',
    r.process || '',
    r.area || '',
    r.auditor || '',
    r.auditado || '',
    r.parameter || '',
    r.cumple || '',
    r.no_cumple_inmediato || '',
    r.no_cumple || '',
    r.na || '',
    r.comentario_auditor || '',
    r.accion_a_tomar || '',
    r.responsable || '',
    r.fecha2 || '',
    r.comentario || '',
  ]);

  return [headers.join(','), ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
}
