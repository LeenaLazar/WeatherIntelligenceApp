import React from 'react';
import { DailyForecast, TempUnit } from '../types/weather';
import { getWeatherCodeInfo, formatTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Sun, ArrowUp, ArrowDown } from 'lucide-react';

interface ForecastGridProps {
  daily: DailyForecast[];
  unit: TempUnit;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({ daily, unit }) => {
  // Find global min and max across the week to draw normalized range bars
  const allMaxTemps = daily.map((d) => d.tempMax);
  const allMinTemps = daily.map((d) => d.tempMin);
  const globalMax = Math.max(...allMaxTemps, 1);
  const globalMin = Math.min(...allMinTemps, 0);
  const totalSpan = Math.max(globalMax - globalMin, 1);

  return (
    <div id="forecast" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">7-Day Weather Forecast</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily temperature spectrum, expected precipitation probability, and atmospheric conditions.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono tabular-nums">
          Week range: {formatTemp(globalMin, unit)} – {formatTemp(globalMax, unit)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {daily.map((day, idx) => {
          const condition = getWeatherCodeInfo(day.weatherCode);
          const isToday = idx === 0;

          // Compute relative bar left and width
          const leftPercent = Math.max(0, ((day.tempMin - globalMin) / totalSpan) * 100);
          const widthPercent = Math.max(8, ((day.tempMax - day.tempMin) / totalSpan) * 100);

          return (
            <div
              key={day.date}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all hover:border-slate-600 hover:shadow-lg ${
                isToday
                  ? 'bg-slate-900/90 border-sky-500/40 ring-1 ring-sky-500/20'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
              }`}
            >
              {/* Day Name & Date */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <div>
                  <div className={`text-sm font-bold ${isToday ? 'text-sky-400' : 'text-slate-200'}`}>
                    {day.dayName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{day.dateLabel}</div>
                </div>
                {isToday && (
                  <span className="text-[10px] font-semibold text-sky-400 px-1.5 py-0.5 bg-sky-950/60 border border-sky-800/50 rounded">
                    Now
                  </span>
                )}
              </div>

              {/* Weather Icon and Condition */}
              <div className="py-3 flex flex-col items-center text-center">
                <div className="p-2.5 rounded-xl bg-slate-800/30 mb-2">
                  <WeatherIcon
                    code={day.weatherCode}
                    className={`w-9 h-9 ${condition.accentColor}`}
                  />
                </div>
                <div className="text-xs font-semibold text-slate-200 line-clamp-1" title={condition.label}>
                  {condition.label}
                </div>
              </div>

              {/* Temperatures & Range Bar */}
              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                <div className="flex items-center justify-between font-mono tabular-nums text-xs">
                  <div className="flex items-center text-rose-300 font-semibold">
                    <ArrowUp className="w-3 h-3 mr-0.5 text-rose-400" />
                    <span>{formatTemp(day.tempMax, unit)}</span>
                  </div>
                  <div className="flex items-center text-sky-300 font-semibold">
                    <ArrowDown className="w-3 h-3 mr-0.5 text-sky-400" />
                    <span>{formatTemp(day.tempMin, unit)}</span>
                  </div>
                </div>

                {/* Relative Temperature Range Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 opacity-80"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Rain probability & Wind max */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1 font-mono tabular-nums">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className={day.precipitationProbability >= 40 ? 'text-blue-300 font-semibold' : ''}>
                      {day.precipitationProbability}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono tabular-nums text-[10px] text-slate-400">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>{Math.round(day.windSpeedMax)} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
