export interface LPARecord {
  id: string;
  no: number;
  fecha: string;
  ano: number;
  mes: string;
  process: string;
  area: string;
  auditor: string;
  auditado: string;
  parameter: string;
  cumple: string; // "X" or ""
  no_cumple_inmediato: string; // "X" or ""
  no_cumple: string; // "X" or ""
  na: string; // "X" or ""
  comentario_auditor: string;
  accion_a_tomar: string;
  responsable: string;
  fecha2: string;
  comentario: string;
  sourceFileName?: string;
}

export interface UploadedImageItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  previewUrl: string;
  base64Data: string;
  mimeType: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  extractedRecordsCount?: number;
}

export const LPA_COLUMNS = [
  "N°",
  "FECHA",
  "AÑO",
  "MES",
  "PROCESS",
  "ÁREA",
  "AUDITOR",
  "AUDITADO",
  "PARAMETER",
  "CUMPLE\n(+2)",
  "NO CUMPLE (CORRIGE DE INMEDIATO)\n(+1)",
  "NO CUMPLE\n(0)",
  "N/A\n(0)",
  "Commentario auditor LPA",
  "ACCIÓN A TOMAR",
  "RESPONSABLE",
  "FECHA2",
  "COMENTARIO",
] as const;
