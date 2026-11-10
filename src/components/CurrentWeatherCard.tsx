import React from 'react';
import { WeatherData, TempUnit } from '../types/weather';
import { getWeatherCodeInfo, getWindDirectionCardinal, formatTemp } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';
import {
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Compass,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  Calendar,
} from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TempUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const { current, location, daily } = weather;
  const condition = getWeatherCodeInfo(current.weatherCode);
  const windDir = getWindDirectionCardinal(current.windDirection);
  const todayForecast = daily[0];

  // UV index category rating
  const getUvRating = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
  };

  const uvRating = getUvRating(current.uvIndex);

  // Format sunrise / sunset times if available
  const formatSunTime = (iso?: string) => {
    if (!iso) return '--:--';
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div
      id="overview"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/80 shadow-2xl p-6 md:p-8"
    >
      {/* Ambient background aura keyed to condition */}
      <div
        className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${condition.bgColor}`}
      />

      <div className="relative z-10 space-y-6">
        {/* City and Location Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              <span>{location.name}</span>
              {location.admin1 && (
                <>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-slate-300">{location.admin1}</span>
                </>
              )}
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-400">{location.country}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              {location.name} Weather Overview
            </h1>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="font-mono tabular-nums text-slate-500 text-[11px]">
              Coordinates: {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </div>
          </div>
        </div>

        {/* Primary Hero Temp & Condition Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Temp & Condition */}
          <div className="lg:col-span-5 flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 shadow-inner flex items-center justify-center shrink-0">
              <WeatherIcon
                code={current.weatherCode}
                className={`w-16 h-16 md:w-20 md:h-20 ${condition.accentColor}`}
              />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {Math.round(unit === 'F' ? (current.temperature * 9) / 5 + 32 : current.temperature)}°
                </span>
                <span className="text-xl md:text-2xl font-semibold text-slate-400">
                  {unit}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="text-base md:text-lg font-semibold text-slate-100">
                  {condition.label}
                </span>
              </div>

              <div className="text-xs md:text-sm text-slate-400 mt-1 flex items-center gap-2">
                <span>Feels like {formatTemp(current.feelsLike, unit)}</span>
                {todayForecast && (
                  <>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-slate-400">
                      H: {formatTemp(todayForecast.tempMax, unit)} / L: {formatTemp(todayForecast.tempMin, unit)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Condition Description Callout */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800/80 rounded-xl p-4">
            <div className="text-xs text-sky-400 font-semibold tracking-wide uppercase">
              Current Conditions
            </div>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {condition.description}. {todayForecast ? `Expected high of ${formatTemp(todayForecast.tempMax, unit)} with ${todayForecast.precipitationProbability}% precipitation probability.` : ''}
            </p>
          </div>
        </div>

        {/* 6-Grid Environmental Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
          {/* Humidity */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Humidity</span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {current.humidity}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {current.humidity > 65 ? 'Humid' : current.humidity < 35 ? 'Dry' : 'Normal'}
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Wind Speed</span>
              <Wind className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {Math.round(current.windSpeed)} <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                <Compass className="w-3 h-3 text-slate-500" />
                <span>{windDir} ({Math.round(current.windDirection)}°)</span>
              </div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Precipitation</span>
              <CloudRain className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {current.precipitation.toFixed(1)} <span className="text-xs font-normal text-slate-400">mm</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {todayForecast ? `${todayForecast.precipitationProbability}% today chance` : 'Hourly rate'}
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">UV Index</span>
              <Sun className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {current.uvIndex.toFixed(1)}
              </div>
              <div className={`text-[11px] font-medium mt-0.5 ${uvRating.color}`}>
                {uvRating.label}
              </div>
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Air Pressure</span>
              <Gauge className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {Math.round(current.surfacePressure)} <span className="text-xs font-normal text-slate-400">hPa</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {current.surfacePressure > 1013 ? 'High pressure' : 'Standard'}
              </div>
            </div>
          </div>

          {/* Solar Cycle */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Sun Cycle</span>
              <Sunrise className="w-4 h-4 text-orange-400" />
            </div>
            <div className="mt-2 space-y-1">
              <div className="text-xs text-slate-300 flex items-center justify-between font-mono tabular-nums">
                <span className="text-slate-400">Rise:</span>
                <span>{formatSunTime(todayForecast?.sunrise)}</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between font-mono tabular-nums">
                <span className="text-slate-400">Set:</span>
                <span>{formatSunTime(todayForecast?.sunset)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
