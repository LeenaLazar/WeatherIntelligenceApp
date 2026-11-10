import React from 'react';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onResetDefault?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onResetDefault,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-center space-y-5 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Weather Data Unavailable
        </h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}

        {onResetDefault && (
          <button
            type="button"
            onClick={onResetDefault}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Load Chennai (Default City)</span>
          </button>
        )}
      </div>
    </div>
  );
};
