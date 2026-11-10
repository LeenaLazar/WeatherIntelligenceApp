import React from 'react';
import { TempUnit } from '../types/weather';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: (unit: TempUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Weather<span className="text-sky-400">Intelligence</span>
          </span>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#overview" className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            Current
          </a>
          <a href="#forecast" className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            7-Day Forecast
          </a>
          <a href="#charts" className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            Weather Charts
          </a>
          <a href="#recommendations" className="hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            Recommendations
          </a>
        </nav>

        {/* Zone 3: Action & Unit Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Unit Toggle */}
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onToggleUnit('C')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('F')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
