import React from 'react';
import { SearchX, ArrowRight, RotateCcw } from 'lucide-react';
import { POPULAR_CITIES } from '../services/weatherApi';
import { GeoLocationResult } from '../types/weather';

interface NoDataStateProps {
  query?: string;
  onResetDefault: () => void;
  onSelectCity: (city: GeoLocationResult) => void;
}

export const NoDataState: React.FC<NoDataStateProps> = ({
  query,
  onResetDefault,
  onSelectCity,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 md:p-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-slate-400">
        <SearchX className="w-8 h-8 text-sky-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          No Weather Data Available
        </h3>
        <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          {query ? (
            <>
              No location found matching{' '}
              <span className="font-semibold text-rose-300 font-mono">"{query}"</span>.
              As a result, no weather data or forecast is displayed.
            </>
          ) : (
            'Invalid search query entered. No weather data or forecast is displayed.'
          )}
        </p>
        <p className="text-xs text-slate-400">
          Please verify your spelling, enter a recognized city name, or choose one of the suggested cities below.
        </p>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onResetDefault}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Chennai (Default City)</span>
        </button>
      </div>

      {/* Quick fallback cities */}
      <div className="pt-4 border-t border-slate-800/80">
        <span className="text-xs font-medium text-slate-400 block mb-3">
          Or view live weather for a popular city:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectCity(c)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>{c.name}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
