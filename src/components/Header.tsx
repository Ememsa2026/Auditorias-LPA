import React from 'react';
import { FileSpreadsheet, ShieldCheck, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenRules: () => void;
  recordCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenRules, recordCount }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center shadow-inner border border-blue-500/30">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Auditorías LPA: Extractor a Excel
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                E-FSIG 023
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Extracción inteligente de listas manuscritas de Auditoría por Capas hacia la base de datos oficial
            </p>
          </div>
        </div>

        {/* Badges and Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini 3.8 Flash Vision</span>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 px-3 py-1.5 rounded-lg font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hoja: 4. Base de datos encuesta</span>
            {recordCount > 0 && (
              <span className="ml-1 bg-emerald-800/80 px-1.5 py-0.2 rounded text-[11px] text-white">
                {recordCount} filas
              </span>
            )}
          </div>

          <button
            onClick={onOpenRules}
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
            title="Ver reglas y criterios de extracción"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Reglas LPA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
