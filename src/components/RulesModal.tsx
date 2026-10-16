import React from 'react';
import { X, CheckCircle, FileText, Cpu, AlertTriangle, ArrowRight } from 'lucide-react';
import { LPA_COLUMNS } from '../types/lpa';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#1F497D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-lg">Criterios de Extracción LPA (Código E-FSIG 023)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          <section className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              1. Cabeceras y Metadatos
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Extrae <strong>Fecha</strong> (DD/MM/YYYY), <strong>Año</strong> (ej: 2026), <strong>Mes</strong> (nombre completo en español, ej: Agosto), <strong>Auditor</strong> y <strong>Auditado</strong>.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-slate-700" />
              2. Filtro Automático de Proceso, Área y Código de Máquina
            </h4>
            <p className="text-slate-600 leading-relaxed mb-2">
              Si en la cabecera el área/proceso contiene un código de máquina al final separado por guion (ejemplo: <code>"EXTRUSIÓN - TREFILADO - TEF 002E"</code>):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 ml-2">
              <li>Identifica el código de la Máquina (ej: <code>TEF 002E</code>).</li>
              <li>En <strong>PROCESS</strong> y <strong>ÁREA</strong> omite la máquina y el último guion (ej: <code>"EXTRUSIÓN - TREFILADO"</code>).</li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              3. Matriz de Cumplimiento (+2, +1, 0, N/A)
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Cada ítem auditado contiene exclusivamente la marca <strong>"X"</strong> (mayúscula) o se mantiene vacío (<code>""</code>) en las siguientes 4 categorías mutuamente excluyentes:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs font-medium text-center">
              <div className="bg-emerald-100/70 border border-emerald-300 text-emerald-800 p-2 rounded-lg">
                CUMPLE (+2)
              </div>
              <div className="bg-amber-100/70 border border-amber-300 text-amber-800 p-2 rounded-lg">
                NO CUMPLE INMEDIATO (+1)
              </div>
              <div className="bg-rose-100/70 border border-rose-300 text-rose-800 p-2 rounded-lg">
                NO CUMPLE (0)
              </div>
              <div className="bg-slate-200 border border-slate-300 text-slate-700 p-2 rounded-lg">
                N/A (0)
              </div>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              4. Transcripción y Autocompletado de Comentarios
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>• <strong>Transcripción fiel:</strong> Se transcribe fielmente lo manuscrito en "comentario_auditor", interpretando caligrafía técnica con base en seguridad y manufactura.</li>
              <li>
                • <strong>Autocompletado de vacíos:</strong> Si NO hay comentario manuscrito para esa fila:
                <div className="ml-4 mt-1 space-y-1 text-xs">
                  <div>- Si el área/proceso es <code>LATONES</code>, <code>FORJA Y LLAVES</code> o <code>SERIADA</code>: coloca el código de máquina identificado (ej: <code>TNI 002E</code>, <code>CPN 001E</code>).</div>
                  <div>- Si el área/proceso es <code>ALMACÉN</code> o <code>ALMACEN</code>: coloca el nombre del proceso.</div>
                  <div>- En caso contrario, se deja vacío.</div>
                </div>
              </li>
            </ul>
          </section>

          <section className="border border-slate-200 rounded-xl p-4">
            <h4 className="font-semibold text-slate-900 mb-2">5. Estructura de las 18 Columnas Oficiales (Hoja "4. Base de datos encuesta")</h4>
            <div className="flex flex-wrap gap-1.5">
              {LPA_COLUMNS.map((col, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs bg-slate-100 border border-slate-300 px-2 py-1 rounded text-slate-700"
                >
                  <span className="text-[10px] text-slate-400 mr-1 font-mono">#{idx + 1}</span>
                  {col.replace('\n', ' ')}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
