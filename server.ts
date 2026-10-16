import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Soporte para imágenes de alta resolución en Base64
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Inicialización de Gemini SDK en el servidor con User-Agent de AI Studio
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const SYSTEM_PROMPT = `
Eres un auditor experto en control de calidad y transcripción de datos visuales, especializado en el formato "Lista de Verificación de Auditoría por Capas LPA" (Código E-FSIG 023).

Tu tarea es extraer fielmente los datos de la hoja de auditoría manuscrita y devolverlos estrictamente en formato JSON estructurado.

Reglas de extracción:
1. Cabeceras:
   - Extrae Fecha (DD/MM/YYYY), Año (número entero), Mes (nombre en texto ej: Enero, Febrero, etc.), Auditor y Auditado.
2. Filtro de Proceso y Área:
   - Si en la cabecera el área/proceso contiene un código de máquina al final separado por guion (ej: "EXTRUSIÓN - TREFILADO - TEF 002E"):
     * Identifica el código de la Máquina ("TEF 002E").
     * En PROCESS y ÁREA omite la máquina y el último guion (ej: "EXTRUSIÓN - TREFILADO" o "LATONES").
3. Tabla de Parámetros:
   - Procesa cada fila o ítem evaluado visible en la imagen.
   - Las columnas de cumplimiento solo pueden tener el valor "X" (mayúscula) o estar vacías ("").
4. Transcripción de Comentarios a Mano:
   - Transcribe fielmente lo manuscrito en "comentario_auditor". Si hay caligrafía dudosa, interpreta por el contexto de seguridad industrial y manufactura.
5. Autocompletado de Comentarios Vacíos:
   - Si NO hay comentario manuscrito para esa fila:
     * Si el área/proceso es LATONES, FORJA Y LLAVES o SERIADA: coloca el código de máquina identificado (ej: "TNI 002E", "CPN 001E").
     * Si el área/proceso es ALMACÉN o ALMACEN: coloca el nombre del proceso.
     * En caso contrario, déjalo vacío ("").
6. ACCIÓN A TOMAR, RESPONSABLE, FECHA2 y COMENTARIO:
   - Extraer solo si existen notas manuscritas en las casillas correspondientes de la hoja; de lo contrario dejar en blanco ("").
`;

  // Endpoint de verificación del estado del servicio
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
    });
  });

  // Endpoint para procesar imágenes con Gemini Multimodal
  app.post('/api/extract-lpa', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', fileName = 'imagen_lpa.jpg' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          error: 'No se proporcionó la imagen en formato base64.',
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: 'GEMINI_API_KEY no está configurada en las variables de entorno del servidor. Por favor verifique el panel Secrets.',
        });
      }

      // Remover cualquier prefijo de Data URL (data:image/jpeg;base64,...)
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

      // Función con reintentos para mitigar errores 503 o 429 temporales
      let response: any = null;
      let lastError: any = null;
      const maxRetries = 3;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                {
                  text: 'Extrae con máxima precisión todos los ítems evaluados y datos de cabecera de esta hoja de auditoría LPA (Código E-FSIG 023). Sigue estrictamente todas las reglas de transcripción y formato JSON.',
                },
              ],
            },
            config: {
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fecha: { type: Type.STRING, description: 'Fecha en formato DD/MM/YYYY' },
                    ano: { type: Type.INTEGER, description: 'Año numérico' },
                    mes: { type: Type.STRING, description: 'Nombre del mes en español' },
                    process: { type: Type.STRING, description: 'Nombre del proceso sin código de máquina' },
                    area: { type: Type.STRING, description: 'Nombre del área sin código de máquina' },
                    auditor: { type: Type.STRING, description: 'Nombre del auditor' },
                    auditado: { type: Type.STRING, description: 'Nombre del auditado' },
                    parameter: { type: Type.STRING, description: 'Pregunta o ítem evaluado' },
                    cumple: { type: Type.STRING, description: '"X" si cumple (+2), o vacío ""' },
                    no_cumple_inmediato: { type: Type.STRING, description: '"X" si no cumple de inmediato (+1), o vacío ""' },
                    no_cumple: { type: Type.STRING, description: '"X" si no cumple (0), o vacío ""' },
                    na: { type: Type.STRING, description: '"X" si no aplica (0), o vacío ""' },
                    comentario_auditor: { type: Type.STRING, description: 'Comentario manuscrito transcrito o código autocompletado' },
                    accion_a_tomar: { type: Type.STRING, description: 'Acción correctiva manuscrita o vacío ""' },
                    responsable: { type: Type.STRING, description: 'Responsable de la acción o vacío ""' },
                    fecha2: { type: Type.STRING, description: 'Fecha de la acción correctiva o vacío ""' },
                    comentario: { type: Type.STRING, description: 'Comentario de seguimiento o vacío ""' },
                  },
                  required: [
                    'fecha',
                    'ano',
                    'mes',
                    'process',
                    'area',
                    'auditor',
                    'auditado',
                    'parameter',
                    'cumple',
                    'no_cumple_inmediato',
                    'no_cumple',
                    'na',
                    'comentario_auditor',
                  ],
                },
              },
            },
          });
          break; // Exitoso, salir del ciclo
        } catch (err: any) {
          lastError = err;
          console.warn(`Intento ${attempt}/${maxRetries} falló:`, err.message || err);
          if (attempt < maxRetries) {
            // Esperar antes del siguiente intento
            await new Promise((res) => setTimeout(res, 1200 * attempt));
          }
        }
      }

      if (!response) {
        throw lastError || new Error('No se pudo obtener respuesta del modelo tras varios intentos.');
      }

      const rawJson = response.text?.trim() || '[]';
      let parsed: any;
      try {
        parsed = JSON.parse(rawJson);
      } catch (err) {
        console.warn('Fallo al parsear JSON devuelto por Gemini, intentando recuperar:', rawJson);
        const match = rawJson.match(/\[.*\]/s);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('La respuesta del modelo no contiene una lista JSON válida.');
        }
      }

      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          const arrayProp = Object.values(parsed).find((val) => Array.isArray(val));
          parsed = (arrayProp as any[]) || [];
        } else {
          parsed = [];
        }
      }

      // Normalizar estructura
      const normalizedRecords = parsed.map((item: any, idx: number) => ({
        id: `rec-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        no: idx + 1,
        fecha: item.fecha || '',
        ano: item.ano || new Date().getFullYear(),
        mes: item.mes || '',
        process: item.process || '',
        area: item.area || '',
        auditor: item.auditor || '',
        auditado: item.auditado || '',
        parameter: item.parameter || '',
        cumple: item.cumple === 'X' || item.cumple === 'x' ? 'X' : '',
        no_cumple_inmediato: item.no_cumple_inmediato === 'X' || item.no_cumple_inmediato === 'x' ? 'X' : '',
        no_cumple: item.no_cumple === 'X' || item.no_cumple === 'x' ? 'X' : '',
        na: item.na === 'X' || item.na === 'x' ? 'X' : '',
        comentario_auditor: item.comentario_auditor || '',
        accion_a_tomar: item.accion_a_tomar || '',
        responsable: item.responsable || '',
        fecha2: item.fecha2 || '',
        comentario: item.comentario || '',
        sourceFileName: fileName,
      }));

      return res.json({
        success: true,
        count: normalizedRecords.length,
        records: normalizedRecords,
      });
    } catch (error: any) {
      console.error('Error al procesar hoja LPA con Gemini:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error procesando la imagen con Gemini 3.8 Flash.',
      });
    }
  });

  // Integración con Vite en desarrollo o estáticos en producción
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor LPA Extractor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fallo crítico al iniciar el servidor:', err);
  process.exit(1);
});
