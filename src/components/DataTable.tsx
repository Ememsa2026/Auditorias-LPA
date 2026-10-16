import React, { useState } from 'react';
import { LPARecord, LPA_COLUMNS } from '../types/lpa';
import {
  Download,
  Copy,
  Plus,
  Trash2,
  Search,
  Check,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { generateLPAExcel, downloadExcelBlob, recordsToTSV, recordsToCSV } from '../utils/excelExport';

interface DataTableProps {
  records: LPARecord[];
  onUpdateRecord: (id: string, updated: Partial<LPARecord>) => void;
  onDeleteRecord: (id: string) => void;
  onAddRecord: () => void;
  onClearRecords: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  records,
  onUpdateRecord,
  onDeleteRecord,
  onAddRecord,
  onClearRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('ALL');
  const [complianceFilter, setComplianceFilter] = useState('ALL');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Procesos únicos para filtrado
  const processes = Array.from(new Set(records.map((r) => r.process).filter(Boolean)));

  // Filtrado reactivo
  const filteredRecords = records.filter((rec) => {
    // Búsqueda de texto
    const searchTarget = `${rec.parameter} ${rec.process} ${rec.area} ${rec.auditor} ${rec.auditado} ${rec.comentario_auditor} ${rec.accion_a_tomar} ${rec.responsable}`.toLowerCase();
    const matchesSearch = !searchTerm || searchTarget.includes(searchTerm.toLowerCase());

    // Filtro de proceso
    const matchesProcess = selectedProcess === 'ALL' || rec.process === selectedProcess;

    // Filtro de cumplimiento
    let matchesCompliance = true;
    if (complianceFilter === 'cumple') matchesCompliance = rec.cumple === 'X';
    else if (complianceFilter === 'no_cumple_inm') matchesCompliance = rec.no_cumple_inmediato === 'X';
    else if (complianceFilter === 'no_cumple') matchesCompliance = rec.no_cumple === 'X';
    else if (complianceFilter === 'na') matchesCompliance = rec.na === 'X';

    return matchesSearch && matchesProcess && matchesCompliance;
  });

  const handleDownloadExcel = async () => {
    if (records.length === 0) return;
    setIsExporting(true);
    try {
      const blob = await generateLPAExcel(records);
      downloadExcelBlob(blob, 'auditoria_lpa_datos.xlsx');
    } catch (err) {
      console.error('Error generando archivo Excel:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTSV = () => {
    if (records.length === 0) return;
    const tsv = recordsToTSV(records);
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    if (records.length === 0) return;
    const csv = recordsToCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auditoria_lpa_datos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSetCompliance = (id: string, type: 'cumple' | 'no_cumple_inmediato' | 'no_cumple' | 'na') => {
    const current = records.find((r) => r.id === id);
    if (!current) return;

    // Mutuamente excluyentes
    onUpdateRecord(id, {
      cumple: type === 'cumple' ? (current.cumple === 'X' ? '' : 'X') : '',
      no_cumple_inmediato: type === 'no_cumple_inmediato' ? (current.no_cumple_inmediato === 'X' ? '' : 'X') : '',
      no_cumple: type === 'no_cumple' ? (current.no_cumple === 'X' ? '' : 'X') : '',
      na: type === 'na' ? (current.na === 'X' ? '' : 'X') : '',
    });
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-sm">
        <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">Sin datos de auditoría cargados</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Sube fotos de tus hojas de verificación LPA arriba o haz clic en "Cargar muestra de prueba" para explorar la visualización y exportación.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Table Header and Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                Vista previa de datos extraídos
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Hoja: 4. Base de datos encuesta
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mostrando {filteredRecords.length} de {records.length} registros. Puedes editar cualquier celda directamente.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="px-4 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Descargar archivo Excel con estilos oficiales E-FSIG 023"
            >
              <Download className="w-4 h-4" />
              <span>Descargar auditoria_lpa_datos.xlsx</span>
            </button>

            <button
              onClick={handleCopyTSV}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium flex items-center space-x-1.5 shadow-xs transition-colors"
              title="Copiar datos tabulados para pegar directamente en Excel o Google Sheets"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Copiado al portapapeles' : 'Copiar TSV'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium flex items-center space-x-1.5 shadow-xs transition-colors"
              title="Descargar archivo CSV"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>CSV</span>
            </button>

            <button
              onClick={onAddRecord}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
              title="Añadir una fila vacía para ingresar datos manualmente"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Fila</span>
            </button>

            <button
              onClick={onClearRecords}
              className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium transition-colors border border-rose-200"
              title="Vaciar tabla"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por parámetro, área, auditor, auditado, máquina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Process Filter */}
          {processes.length > 0 && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">Todos los Procesos ({processes.length})</option>
                {processes.map((proc) => (
                  <option key={proc} value={proc}>
                    {proc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Compliance Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="cumple">Solo Cumple (+2)</option>
              <option value="no_cumple_inm">Solo Corrige Inmediato (+1)</option>
              <option value="no_cumple">Solo No Cumple (0)</option>
              <option value="na">Solo N/A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full border-collapse text-xs text-slate-700">
          {/* Header Row Styled exactly like the Excel template (#1F497D with white text) */}
          <thead className="sticky top-0 z-20 bg-[#1F497D] text-white shadow-sm">
            <tr>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-center w-12">N°</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-center min-w-[90px]">FECHA</th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center w-14">AÑO</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-center min-w-[80px]">MES</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[140px]">PROCESS</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[140px]">ÁREA</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[130px]">AUDITOR</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[130px]">AUDITADO</th>
              <th className="py-2.5 px-4 border border-slate-600 font-bold text-left min-w-[260px]">PARAMETER</th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center min-w-[70px] bg-[#163a66]" title="+2 puntos">
                CUMPLE<br/><span className="text-[10px] font-normal opacity-90">(+2)</span>
              </th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center min-w-[85px] bg-[#163a66]" title="+1 punto">
                NO CUMPLE<br/><span className="text-[10px] font-normal opacity-90">(CORR. INM +1)</span>
              </th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center min-w-[75px] bg-[#163a66]" title="0 puntos">
                NO CUMPLE<br/><span className="text-[10px] font-normal opacity-90">(0)</span>
              </th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center min-w-[60px] bg-[#163a66]" title="No Aplica">
                N/A<br/><span className="text-[10px] font-normal opacity-90">(0)</span>
              </th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[160px]">Commentario auditor LPA</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[140px]">ACCIÓN A TOMAR</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[120px]">RESPONSABLE</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-center min-w-[90px]">FECHA2</th>
              <th className="py-2.5 px-3 border border-slate-600 font-bold text-left min-w-[140px]">COMENTARIO</th>
              <th className="py-2.5 px-2 border border-slate-600 font-bold text-center w-10">ACCIONES</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-sans">
            {filteredRecords.map((rec, index) => (
              <tr
                key={rec.id}
                className={`hover:bg-blue-50/40 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                }`}
              >
                {/* 1. N° */}
                <td className="py-2 px-2 border border-slate-200 text-center font-mono font-medium text-slate-500 bg-slate-50/70">
                  {rec.no || index + 1}
                </td>

                {/* 2. FECHA */}
                <td className="py-1 px-2 border border-slate-200 text-center">
                  <input
                    type="text"
                    value={rec.fecha}
                    onChange={(e) => onUpdateRecord(rec.id, { fecha: e.target.value })}
                    className="w-full text-center bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none font-mono"
                  />
                </td>

                {/* 3. AÑO */}
                <td className="py-1 px-1 border border-slate-200 text-center">
                  <input
                    type="number"
                    value={rec.ano}
                    onChange={(e) => onUpdateRecord(rec.id, { ano: Number(e.target.value) || rec.ano })}
                    className="w-full text-center bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-0.5 py-0.5 outline-none font-mono"
                  />
                </td>

                {/* 4. MES */}
                <td className="py-1 px-2 border border-slate-200 text-center">
                  <input
                    type="text"
                    value={rec.mes}
                    onChange={(e) => onUpdateRecord(rec.id, { mes: e.target.value })}
                    className="w-full text-center bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none capitalize"
                  />
                </td>

                {/* 5. PROCESS */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.process}
                    onChange={(e) => onUpdateRecord(rec.id, { process: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none font-medium text-slate-800"
                  />
                </td>

                {/* 6. ÁREA */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.area}
                    onChange={(e) => onUpdateRecord(rec.id, { area: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none"
                  />
                </td>

                {/* 7. AUDITOR */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.auditor}
                    onChange={(e) => onUpdateRecord(rec.id, { auditor: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none font-medium"
                  />
                </td>

                {/* 8. AUDITADO */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.auditado}
                    onChange={(e) => onUpdateRecord(rec.id, { auditado: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none"
                  />
                </td>

                {/* 9. PARAMETER */}
                <td className="py-1 px-2 border border-slate-200">
                  <textarea
                    rows={2}
                    value={rec.parameter}
                    onChange={(e) => onUpdateRecord(rec.id, { parameter: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none resize-none leading-relaxed text-slate-800"
                  />
                </td>

                {/* 10. CUMPLE (+2) */}
                <td
                  onClick={() => handleSetCompliance(rec.id, 'cumple')}
                  className={`py-1 px-1 border border-slate-200 text-center cursor-pointer transition-colors ${
                    rec.cumple === 'X' ? 'bg-emerald-100/70 font-bold text-emerald-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-block w-6 h-6 leading-6 text-sm">
                    {rec.cumple || ''}
                  </span>
                </td>

                {/* 11. NO CUMPLE INMEDIATO (+1) */}
                <td
                  onClick={() => handleSetCompliance(rec.id, 'no_cumple_inmediato')}
                  className={`py-1 px-1 border border-slate-200 text-center cursor-pointer transition-colors ${
                    rec.no_cumple_inmediato === 'X' ? 'bg-amber-100/70 font-bold text-amber-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-block w-6 h-6 leading-6 text-sm">
                    {rec.no_cumple_inmediato || ''}
                  </span>
                </td>

                {/* 12. NO CUMPLE (0) */}
                <td
                  onClick={() => handleSetCompliance(rec.id, 'no_cumple')}
                  className={`py-1 px-1 border border-slate-200 text-center cursor-pointer transition-colors ${
                    rec.no_cumple === 'X' ? 'bg-rose-100/70 font-bold text-rose-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-block w-6 h-6 leading-6 text-sm">
                    {rec.no_cumple || ''}
                  </span>
                </td>

                {/* 13. N/A (0) */}
                <td
                  onClick={() => handleSetCompliance(rec.id, 'na')}
                  className={`py-1 px-1 border border-slate-200 text-center cursor-pointer transition-colors ${
                    rec.na === 'X' ? 'bg-slate-200 font-bold text-slate-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="inline-block w-6 h-6 leading-6 text-sm">
                    {rec.na || ''}
                  </span>
                </td>

                {/* 14. Commentario auditor LPA */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.comentario_auditor}
                    onChange={(e) => onUpdateRecord(rec.id, { comentario_auditor: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none font-medium text-slate-800"
                    placeholder="Comentario / Máquina"
                  />
                </td>

                {/* 15. ACCIÓN A TOMAR */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.accion_a_tomar}
                    onChange={(e) => onUpdateRecord(rec.id, { accion_a_tomar: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none"
                    placeholder="Acción correctiva"
                  />
                </td>

                {/* 16. RESPONSABLE */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.responsable}
                    onChange={(e) => onUpdateRecord(rec.id, { responsable: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none"
                  />
                </td>

                {/* 17. FECHA2 */}
                <td className="py-1 px-2 border border-slate-200 text-center">
                  <input
                    type="text"
                    value={rec.fecha2}
                    onChange={(e) => onUpdateRecord(rec.id, { fecha2: e.target.value })}
                    className="w-full text-center bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none font-mono"
                  />
                </td>

                {/* 18. COMENTARIO */}
                <td className="py-1 px-2 border border-slate-200">
                  <input
                    type="text"
                    value={rec.comentario}
                    onChange={(e) => onUpdateRecord(rec.id, { comentario: e.target.value })}
                    className="w-full bg-transparent focus:bg-white focus:ring-1 focus:ring-blue-500 rounded px-1 py-0.5 outline-none"
                  />
                </td>

                {/* ACCIONES */}
                <td className="py-1 px-1 border border-slate-200 text-center">
                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Eliminar fila"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer information */}
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <span>* Tip: Haz clic en las casillas de cumplimiento (CUMPLE, NO CUMPLE, N/A) para alternar rápidamente la marca "X".</span>
        </div>
        <div className="font-medium text-slate-600">
          Total: {filteredRecords.length} filas listas para exportar
        </div>
      </div>
    </div>
  );
};
