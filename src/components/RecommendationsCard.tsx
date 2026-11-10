import React from 'react';
import { CurrentWeather, DailyForecast } from '../types/weather';
import { generateWeatherRecommendations } from '../utils/recommendations';
import { WeatherIcon } from './WeatherIcon';
import { Sparkles, Info } from 'lucide-react';

interface RecommendationsCardProps {
  current: CurrentWeather;
  daily: DailyForecast[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ current, daily }) => {
  const recommendations = generateWeatherRecommendations(current, daily);

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'essential':
        return {
          border: 'border-amber-500/30 hover:border-amber-500/50',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          iconBg: 'bg-amber-500/15 text-amber-400',
        };
      case 'favorable':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          iconBg: 'bg-emerald-500/15 text-emerald-400',
        };
      default:
        return {
          border: 'border-sky-500/30 hover:border-sky-500/50',
          badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
          iconBg: 'bg-sky-500/15 text-sky-400',
        };
    }
  };

  return (
    <div id="recommendations" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Intelligent Weather Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Actionable guidance derived in real time from Open-Meteo atmospheric readings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Calculated directly from live sensor parameters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const styles = getUrgencyStyles(rec.urgency);

          return (
            <div
              key={rec.id}
              className={`rounded-2xl bg-slate-900/70 border ${styles.border} p-5 shadow-lg flex flex-col justify-between transition-all hover:bg-slate-900/90`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${styles.iconBg} shrink-0`}>
                      <WeatherIcon iconName={rec.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {rec.title}
                      </h3>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {rec.category}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${styles.badge} shrink-0`}
                  >
                    {rec.urgency}
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {rec.message}
                </p>
              </div>

              {/* Data trigger explanation */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-400">Trigger metric:</span>
                <span className="font-mono text-slate-300 text-[11px] font-medium tabular-nums">
                  {rec.triggerMetric}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
