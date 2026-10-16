import React from 'react';
import { LPARecord } from '../types/lpa';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Award, ListFilter } from 'lucide-react';

interface MetricsCardsProps {
  records: LPARecord[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  records,
  activeFilter,
  onFilterChange,
}) => {
  if (records.length === 0) return null;

  const total = records.length;
  const cumpleCount = records.filter((r) => r.cumple === 'X').length;
  const noCumpleInmCount = records.filter((r) => r.no_cumple_inmediato === 'X').length;
  const noCumpleCount = records.filter((r) => r.no_cumple === 'X').length;
  const naCount = records.filter((r) => r.na === 'X').length;

  const evaluable = cumpleCount + noCumpleInmCount + noCumpleCount;
  const score = evaluable > 0 ? Math.round(((cumpleCount * 2 + noCumpleInmCount * 1) / (evaluable * 2)) * 100) : 100;

  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 75) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Card */}
      <button
        onClick={() => onFilterChange('all')}
        className={`p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'all'
            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium opacity-80">Total Ítems</span>
          <ListFilter className="w-4 h-4 opacity-70" />
        </div>
        <div className="text-2xl font-bold">{total}</div>
        <div className="text-[11px] opacity-75 mt-0.5">Base evaluada</div>
      </button>

      {/* Cumple Card */}
      <button
        onClick={() => onFilterChange('cumple')}
        className={`p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'cumple'
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-emerald-50/60 hover:bg-emerald-100/50 text-emerald-900 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">Cumple (+2)</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-bold">{cumpleCount}</div>
        <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
          {total > 0 ? Math.round((cumpleCount / total) * 100) : 0}% del total
        </div>
      </button>

      {/* No Cumple Inmediato */}
      <button
        onClick={() => onFilterChange('no_cumple_inmediato')}
        className={`p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'no_cumple_inmediato'
            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
            : 'bg-amber-50/60 hover:bg-amber-100/50 text-amber-900 border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">Corrige Inm. (+1)</span>
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-2xl font-bold">{noCumpleInmCount}</div>
        <div className="text-[11px] text-amber-700 font-medium mt-0.5">
          {total > 0 ? Math.round((noCumpleInmCount / total) * 100) : 0}% del total
        </div>
      </button>

      {/* No Cumple */}
      <button
        onClick={() => onFilterChange('no_cumple')}
        className={`p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'no_cumple'
            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
            : 'bg-rose-50/60 hover:bg-rose-100/50 text-rose-900 border-rose-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">No Cumple (0)</span>
          <XCircle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-2xl font-bold">{noCumpleCount}</div>
        <div className="text-[11px] text-rose-700 font-medium mt-0.5">
          {total > 0 ? Math.round((noCumpleCount / total) * 100) : 0}% del total
        </div>
      </button>

      {/* N/A */}
      <button
        onClick={() => onFilterChange('na')}
        className={`p-3.5 rounded-xl border text-left transition-all ${
          activeFilter === 'na'
            ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold">N/A (0)</span>
          <MinusCircle className="w-4 h-4 text-slate-500" />
        </div>
        <div className="text-2xl font-bold">{naCount}</div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          {total > 0 ? Math.round((naCount / total) * 100) : 0}% del total
        </div>
      </button>

      {/* Puntaje Calidad LPA */}
      <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${getScoreColor(score)}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold uppercase tracking-wider">Score LPA</span>
          <Award className="w-4 h-4" />
        </div>
        <div className="text-2xl font-black">{score}%</div>
        <div className="text-[11px] font-medium opacity-90 mt-0.5">
          {score >= 90 ? 'Conforme Alto' : score >= 75 ? 'Aceptable' : 'Acción Requerida'}
        </div>
      </div>
    </div>
  );
};
