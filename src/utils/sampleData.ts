import { LPARecord } from '../types/lpa';

export const SAMPLE_LPA_RECORDS: LPARecord[] = [
  {
    id: 'demo-1',
    no: 1,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'Forja y Llaves',
    area: 'LLAVES - NIQUELADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Díaz Navarro Ramirez',
    parameter: '¿Los parametros del baño (tiempo/proceso) son los establecidos en la hoja técnica?',
    cumple: 'X',
    no_cumple_inmediato: '',
    no_cumple: '',
    na: '',
    comentario_auditor: 'TNI 002E',
    accion_a_tomar: '',
    responsable: '',
    fecha2: '',
    comentario: '',
    sourceFileName: 'demo_auditoria_llaves_tni.jpg',
  },
  {
    id: 'demo-2',
    no: 2,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'Forja y Llaves',
    area: 'LLAVES - NIQUELADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Díaz Navarro Ramirez',
    parameter: '¿El personal cuenta y utiliza los EPPs específicos para el trasvase de químicos?',
    cumple: 'X',
    no_cumple_inmediato: '',
    no_cumple: '',
    na: '',
    comentario_auditor: 'Uso de careta y guantes de nitrilo verificado',
    accion_a_tomar: '',
    responsable: '',
    fecha2: '',
    comentario: '',
    sourceFileName: 'demo_auditoria_llaves_tni.jpg',
  },
  {
    id: 'demo-3',
    no: 3,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'Forja y Llaves',
    area: 'LLAVES - NIQUELADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Díaz Navarro Ramirez',
    parameter: '¿Se encuentra visible y actualizada la hoja de control de parámetros por turno?',
    cumple: '',
    no_cumple_inmediato: 'X',
    no_cumple: '',
    na: '',
    comentario_auditor: 'Hoja sucia y descolgada del atril',
    accion_a_tomar: 'Se reemplaza mica protectora de hoja de control',
    responsable: 'Díaz Navarro',
    fecha2: '31/08/2026',
    comentario: 'Corregido durante la auditoría',
    sourceFileName: 'demo_auditoria_llaves_tni.jpg',
  },
  {
    id: 'demo-4',
    no: 4,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'Forja y Llaves',
    area: 'LLAVES - NIQUELADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Díaz Navarro Ramirez',
    parameter: '¿La temperatura del tanque de desengrase electrolítico está entre 65°C y 75°C?',
    cumple: 'X',
    no_cumple_inmediato: '',
    no_cumple: '',
    na: '',
    comentario_auditor: 'Lectura pirómetro 71.4°C en rango',
    accion_a_tomar: '',
    responsable: '',
    fecha2: '',
    comentario: '',
    sourceFileName: 'demo_auditoria_llaves_tni.jpg',
  },
  {
    id: 'demo-5',
    no: 5,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'Forja y Llaves',
    area: 'LLAVES - NIQUELADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Díaz Navarro Ramirez',
    parameter: '¿Se ejecuta la verificación metrológica del espesor de capa según plan?',
    cumple: '',
    no_cumple_inmediato: '',
    no_cumple: 'X',
    na: '',
    comentario_auditor: 'Equipo x-ray en calibración externa pendiente',
    accion_a_tomar: 'Seguimiento con Laboratorio Central para retorno de equipo',
    responsable: 'Ing. M. Ramos',
    fecha2: '04/09/2026',
    comentario: 'Se usa método gravimétrico de contingencia',
    sourceFileName: 'demo_auditoria_llaves_tni.jpg',
  },
  {
    id: 'demo-6',
    no: 6,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'EXTRUSIÓN - TREFILADO',
    area: 'EXTRUSIÓN - TREFILADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Mendoza Quispe Carlos',
    parameter: '¿La velocidad de trefilado y la lubricación en dados se encuentran conformes?',
    cumple: 'X',
    no_cumple_inmediato: '',
    no_cumple: '',
    na: '',
    comentario_auditor: 'TEF 002E',
    accion_a_tomar: '',
    responsable: '',
    fecha2: '',
    comentario: '',
    sourceFileName: 'demo_auditoria_trefilado_tef.jpg',
  },
  {
    id: 'demo-7',
    no: 7,
    fecha: '31/08/2026',
    ano: 2026,
    mes: 'Agosto',
    process: 'EXTRUSIÓN - TREFILADO',
    area: 'EXTRUSIÓN - TREFILADO',
    auditor: 'GUSTAVSON ANTONIO',
    auditado: 'Mendoza Quispe Carlos',
    parameter: '¿Las guardas de seguridad de enrollado de bobina están operativas?',
    cumple: 'X',
    no_cumple_inmediato: '',
    no_cumple: '',
    na: '',
    comentario_auditor: 'TEF 002E',
    accion_a_tomar: '',
    responsable: '',
    fecha2: '',
    comentario: '',
    sourceFileName: 'demo_auditoria_trefilado_tef.jpg',
  },
];

/**
 * Genera una imagen sintética tipo documento LPA escaneado / fotografiado
 * para que el usuario pueda probar el flujo visual de inmediato.
 */
export function generateSyntheticLPADocumentDataUrl(title = 'AUDITORÍA POR CAPAS LPA - E-FSIG 023'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fondo papel con leve textura beige / gris de documento real
  ctx.fillStyle = '#fbfbfa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bordes del formulario impreso
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Encabezado
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(40, 40, canvas.width - 80, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LISTA DE VERIFICACIÓN DE AUDITORÍA POR CAPAS LPA', canvas.width / 2, 75);

  ctx.font = '14px Arial, sans-serif';
  ctx.fillText('CÓDIGO: E-FSIG 023 | SISTEMA INTEGRADO DE GESTIÓN DE CALIDAD', canvas.width / 2, 98);

  // Datos de cabecera manuscritos
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;

  // Box cabecera
  ctx.strokeRect(50, 120, canvas.width - 100, 110);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.textAlign = 'left';

  ctx.fillText('FECHA: 31/08/2026', 70, 150);
  ctx.fillText('PROCESO: FORJA Y LLAVES', 400, 150);
  ctx.fillText('ÁREA: LLAVES - NIQUELADO - TNI 002E', 750, 150);

  ctx.fillText('AUDITOR: GUSTAVSON ANTONIO', 70, 195);
  ctx.fillText('AUDITADO: DÍAZ NAVARRO RAMIREZ', 400, 195);
  ctx.fillText('TURNO: 1ero', 850, 195);

  // Tabla
  const startY = 250;
  const colX = [50, 100, 560, 640, 720, 780, 840, 1150];
  const headers = ['N°', 'PARÁMETRO A AUDITAR', 'CUMPLE\n(+2)', 'NO CUMPLE\nINM (+1)', 'NO CUMPLE\n(0)', 'N/A', 'COMENTARIO AUDITOR'];

  // Header tabla
  ctx.fillStyle = '#1f497d';
  ctx.fillRect(50, startY, canvas.width - 100, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Arial, sans-serif';
  headers.forEach((h, i) => {
    ctx.fillText(h.replace('\n', ' '), colX[i] + 5, startY + 24);
  });

  // Filas simuladas
  const questions = [
    { n: '1', p: '¿Los parametros del baño (tiempo/proceso) son los establecidos en la hoja técnica?', c: 'X', nc1: '', nc: '', na: '', com: 'TNI 002E' },
    { n: '2', p: '¿El personal cuenta y utiliza los EPPs específicos para el trasvase de químicos?', c: 'X', nc1: '', nc: '', na: '', com: 'Uso de careta y guantes de nitrilo' },
    { n: '3', p: '¿Se encuentra visible y actualizada la hoja de control de parámetros por turno?', c: '', nc1: 'X', nc: '', na: '', com: 'Hoja sucia y descolgada del atril' },
    { n: '4', p: '¿La temperatura del tanque de desengrase electrolítico está entre 65°C y 75°C?', c: 'X', nc1: '', nc: '', na: '', com: 'Lectura pirómetro 71.4°C en rango' },
    { n: '5', p: '¿Se ejecuta la verificación metrológica del espesor de capa según plan?', c: '', nc1: '', nc: 'X', na: '', com: 'Equipo x-ray en calibración externa' },
    { n: '6', p: '¿El orden y limpieza (5S) en la batea de enjuague se encuentra conforme?', c: 'X', nc1: '', nc: '', na: '', com: 'TNI 002E' },
    { n: '7', p: '¿Se identifican correctamente los racks de producto en proceso?', c: 'X', nc1: '', nc: '', na: '', com: 'Tarjetas amarillas completas' },
    { n: '8', p: '¿Las paradas de emergencia de la línea de transporte están señalizadas?', c: 'X', nc1: '', nc: '', na: '', com: 'Prueba de pulsador ok' },
  ];

  let currentY = startY + 40;
  questions.forEach((q, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(50, currentY, canvas.width - 100, 50);

    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(50, currentY, canvas.width - 100, 50);

    ctx.fillStyle = '#1e293b';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText(q.n, 65, currentY + 30);
    ctx.fillText(q.p, 110, currentY + 30);

    // X manuscrita azul estilo bolígrafo
    ctx.fillStyle = '#0f3a8a';
    ctx.font = 'bold 20px "Caveat", "Comic Sans MS", cursive, sans-serif';
    if (q.c) ctx.fillText(q.c, 590, currentY + 32);
    if (q.nc1) ctx.fillText(q.nc1, 670, currentY + 32);
    if (q.nc) ctx.fillText(q.nc, 745, currentY + 32);
    if (q.na) ctx.fillText(q.na, 805, currentY + 32);

    ctx.font = 'italic 12px "Caveat", "Comic Sans MS", cursive, sans-serif';
    ctx.fillText(q.com, 850, currentY + 30);

    currentY += 50;
  });

  // Pie con firmas simuladas
  ctx.fillStyle = '#475569';
  ctx.font = '12px Arial, sans-serif';
  ctx.fillText('Firma Auditor: __________________________', 120, currentY + 120);
  ctx.fillText('Firma Auditado: __________________________', 650, currentY + 120);

  // Sello simulado de calidad
  ctx.save();
  ctx.translate(950, currentY + 180);
  ctx.rotate(-0.15);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 3;
  ctx.strokeRect(-90, -35, 180, 70);
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 15px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CONTROL DE CALIDAD', 0, -10);
  ctx.font = 'bold 13px Arial, sans-serif';
  ctx.fillText('AUDITADO SIG', 0, 12);
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.9);
}
