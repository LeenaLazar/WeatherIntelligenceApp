import React, { useState } from 'react';
import { DailyForecast, HourlyForecast, TempUnit } from '../types/weather';
import { formatTemp } from '../utils/weatherCodes';
import { TrendingUp, CloudRain, Clock, Calendar } from 'lucide-react';

interface WeatherChartsProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  unit: TempUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ daily, hourly, unit }) => {
  const [activeTab, setActiveTab] = useState<'7day' | '24hour'>('7day');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // --- 7-Day Temperature Chart Calculations ---
  // We plot max and min temps across 7 days
  const tempValues = daily.flatMap((d) => [d.tempMax, d.tempMin]);
  const minTempRaw = Math.min(...tempValues);
  const maxTempRaw = Math.max(...tempValues);
  const tempPad = Math.max(2, Math.ceil((maxTempRaw - minTempRaw) * 0.15));
  const chartMinTemp = Math.floor(minTempRaw - tempPad);
  const chartMaxTemp = Math.ceil(maxTempRaw + tempPad);
  const chartTempRange = Math.max(chartMaxTemp - chartMinTemp, 1);

  // SVG dimensions for 7-day chart
  const width7 = 720;
  const height7 = 240;
  const paddingX7 = 55;
  const paddingY7 = 35;
  const innerW7 = width7 - paddingX7 * 2;
  const innerH7 = height7 - paddingY7 * 2;

  const getX7 = (index: number) => paddingX7 + (index / (daily.length - 1)) * innerW7;
  const getYTemp7 = (temp: number) => paddingY7 + innerH7 - ((temp - chartMinTemp) / chartTempRange) * innerH7;

  // Max temp path
  const maxPoints7 = daily.map((d, i) => ({ x: getX7(i), y: getYTemp7(d.tempMax) }));
  const minPoints7 = daily.map((d, i) => ({ x: getX7(i), y: getYTemp7(d.tempMin) }));

  const maxPathD = maxPoints7.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const minPathD = minPoints7.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Filled area between max and min
  const areaBetweenD = `${maxPathD} L ${minPoints7[minPoints7.length - 1].x} ${minPoints7[minPoints7.length - 1].y} ` +
    minPoints7.slice().reverse().reduce((acc, pt) => `${acc} L ${pt.x} ${pt.y}`, '') + ' Z';

  // --- Precipitation Chart (Bar & Curve) ---
  const maxRainProb = 100;
  const heightRain = 180;
  const innerHRain = heightRain - paddingY7 * 2;
  const getYRain = (prob: number) => paddingY7 + innerHRain - (prob / maxRainProb) * innerHRain;

  // --- 24-Hour Hourly Chart Calculations ---
  const hourlySubset = hourly.slice(0, 24);
  const hourlyTemps = hourlySubset.map((h) => h.temperature);
  const minHourlyRaw = Math.min(...hourlyTemps);
  const maxHourlyRaw = Math.max(...hourlyTemps);
  const hourlyPad = Math.max(1, Math.ceil((maxHourlyRaw - minHourlyRaw) * 0.2));
  const chartMinHourly = Math.floor(minHourlyRaw - hourlyPad);
  const chartMaxHourly = Math.ceil(maxHourlyRaw + hourlyPad);
  const chartHourlyRange = Math.max(chartMaxHourly - chartMinHourly, 1);

  const width24 = 840;
  const height24 = 240;
  const paddingX24 = 55;
  const paddingY24 = 35;
  const innerW24 = width24 - paddingX24 * 2;
  const innerH24 = height24 - paddingY24 * 2;

  const getX24 = (i: number) => paddingX24 + (i / Math.max(hourlySubset.length - 1, 1)) * innerW24;
  const getY24 = (temp: number) => paddingY24 + innerH24 - ((temp - chartMinHourly) / chartHourlyRange) * innerH24;

  const hourlyPoints = hourlySubset.map((h, i) => ({ x: getX24(i), y: getY24(h.temperature) }));
  const hourlyPathD = hourlyPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const hourlyAreaD = `${hourlyPathD} L ${hourlyPoints[hourlyPoints.length - 1]?.x || 0} ${paddingY24 + innerH24} L ${hourlyPoints[0]?.x || 0} ${paddingY24 + innerH24} Z`;

  return (
    <div id="charts" className="space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            Weather Intelligence Charts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-metric atmospheric curves with interactive value inspection.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('7day');
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === '7day'
                ? 'bg-sky-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7-Day Trend</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('24hour');
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === '24hour'
                ? 'bg-sky-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24-Hour Timeline</span>
          </button>
        </div>
      </div>

      {activeTab === '7day' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 7-Day Temperature Trend Chart */}
          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">7-Day Temperature Spectrum</span>
                <span className="text-xs text-slate-400">(Max & Min °{unit})</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Max
                </span>
                <span className="flex items-center gap-1 text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Min
                </span>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width7} ${height7}`}
                className="w-full h-auto select-none overflow-visible"
              >
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines & Y-Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = paddingY7 + ratio * innerH7;
                  const tempAtY = chartMaxTemp - ratio * chartTempRange;
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingX7}
                        y1={y}
                        x2={width7 - paddingX7}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="3 3"
                        strokeOpacity="0.5"
                      />
                      <text
                        x={paddingX7 - 10}
                        y={y + 4}
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="end"
                        fontFamily="monospace"
                        className="tabular-nums"
                      >
                        {Math.round(unit === 'F' ? (tempAtY * 9) / 5 + 32 : tempAtY)}°
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Day Grid lines */}
                {daily.map((day, i) => {
                  const x = getX7(i);
                  return (
                    <g key={day.date}>
                      <line
                        x1={x}
                        y1={paddingY7}
                        x2={x}
                        y2={paddingY7 + innerH7}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={height7 - 10}
                        fill={hoveredIndex === i ? '#38bdf8' : '#94a3b8'}
                        fontSize="11"
                        fontWeight={hoveredIndex === i ? '700' : '500'}
                        textAnchor="middle"
                      >
                        {day.dayName}
                      </text>
                    </g>
                  );
                })}

                {/* Shaded Area between Min & Max */}
                <path d={areaBetweenD} fill="url(#tempGradient)" />

                {/* Max Temperature Line */}
                <path
                  d={maxPathD}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Min Temperature Line */}
                <path
                  d={minPathD}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points with Hover Circles */}
                {daily.map((day, i) => {
                  const x = getX7(i);
                  const yMax = getYTemp7(day.tempMax);
                  const yMin = getYTemp7(day.tempMin);
                  const isHovered = hoveredIndex === i;

                  return (
                    <g
                      key={`pts-${day.date}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Transparent wider target */}
                      <rect
                        x={x - 20}
                        y={paddingY7}
                        width={40}
                        height={innerH7}
                        fill="transparent"
                      />

                      {/* Max circle */}
                      <circle
                        cx={x}
                        cy={yMax}
                        r={isHovered ? 6 : 4}
                        fill="#f43f5e"
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text
                        x={x}
                        y={yMax - 8}
                        fill="#fda4af"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="tabular-nums"
                      >
                        {formatTemp(day.tempMax, unit)}
                      </text>

                      {/* Min circle */}
                      <circle
                        cx={x}
                        cy={yMin}
                        r={isHovered ? 6 : 4}
                        fill="#38bdf8"
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      <text
                        x={x}
                        y={yMin + 16}
                        fill="#7dd3fc"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="tabular-nums"
                      >
                        {formatTemp(day.tempMin, unit)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover details display */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Hover over any day node to inspect details</span>
              {hoveredIndex !== null && (
                <div className="font-semibold text-sky-400 font-mono tabular-nums">
                  {daily[hoveredIndex].dayName} ({daily[hoveredIndex].dateLabel}): Max {formatTemp(daily[hoveredIndex].tempMax, unit)} / Min {formatTemp(daily[hoveredIndex].tempMin, unit)}
                </div>
              )}
            </div>
          </div>

          {/* Precipitation Probability Chart */}
          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white">Precipitation Probability</span>
              </div>
              <span className="text-xs font-mono text-slate-400">0% – 100%</span>
            </div>

            {/* Bar Chart Container */}
            <div className="relative w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${width7} ${height7}`}
                className="w-full h-auto select-none overflow-visible"
              >
                {/* Horizontal Probability threshold lines */}
                {[0, 25, 50, 75, 100].map((prob) => {
                  const y = getYRain(prob);
                  return (
                    <g key={prob}>
                      <line
                        x1={paddingX7}
                        y1={y}
                        x2={width7 - paddingX7}
                        y2={y}
                        stroke="#334155"
                        strokeDasharray="3 3"
                        strokeOpacity="0.4"
                      />
                      <text
                        x={paddingX7 - 10}
                        y={y + 4}
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="end"
                        fontFamily="monospace"
                        className="tabular-nums"
                      >
                        {prob}%
                      </text>
                    </g>
                  );
                })}

                {/* Bars for each day */}
                {daily.map((day, i) => {
                  const x = getX7(i);
                  const barWidth = 36;
                  const prob = day.precipitationProbability;
                  const y = getYRain(prob);
                  const barHeight = Math.max(3, (paddingY7 + innerHRain) - y);
                  const isHovered = hoveredIndex === i;

                  return (
                    <g
                      key={`rain-${day.date}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Bar */}
                      <rect
                        x={x - barWidth / 2}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill={isHovered ? '#38bdf8' : prob >= 50 ? '#2563eb' : '#0284c7'}
                        opacity={isHovered ? 1 : 0.85}
                        className="transition-all"
                      />

                      {/* Probability percentage label on top of bar */}
                      <text
                        x={x}
                        y={y - 6}
                        fill={prob >= 50 ? '#60a5fa' : '#94a3b8'}
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="tabular-nums"
                      >
                        {prob}%
                      </text>

                      {/* Day label */}
                      <text
                        x={x}
                        y={height7 - 10}
                        fill={isHovered ? '#38bdf8' : '#94a3b8'}
                        fontSize="11"
                        fontWeight={isHovered ? '700' : '500'}
                        textAnchor="middle"
                      >
                        {day.dayName}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Total Rainfall expected footer */}
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Expected 7-day accumulation:</span>
              <span className="font-mono font-bold text-sky-400 tabular-nums">
                {daily.reduce((acc, d) => acc + d.precipitationSum, 0).toFixed(1)} mm total
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* 24-Hour Timeline High-Resolution Curve */
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Next 24 Hours Atmospheric Progression
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hourly temperature trajectory and precipitation probability markers.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 tabular-nums">
              24-hour range: {formatTemp(minHourlyRaw, unit)} to {formatTemp(maxHourlyRaw, unit)}
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${width24} ${height24}`}
              className="w-full h-auto select-none overflow-visible"
            >
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio) => {
                const y = paddingY24 + ratio * innerH24;
                const tempAtY = chartMaxHourly - ratio * chartHourlyRange;
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX24}
                      y1={y}
                      x2={width24 - paddingX24}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 3"
                      strokeOpacity="0.4"
                    />
                    <text
                      x={paddingX24 - 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="end"
                      fontFamily="monospace"
                      className="tabular-nums"
                    >
                      {Math.round(unit === 'F' ? (tempAtY * 9) / 5 + 32 : tempAtY)}°
                    </text>
                  </g>
                );
              })}

              {/* Area & Line */}
              <path d={hourlyAreaD} fill="url(#hourlyGradient)" />
              <path
                d={hourlyPathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points every 2 or 3 hours */}
              {hourlySubset.map((hour, i) => {
                const x = getX24(i);
                const y = getY24(hour.temperature);
                const showLabel = i % 2 === 0;

                return (
                  <g key={`hour-${hour.time}`}>
                    {showLabel && (
                      <>
                        <line
                          x1={x}
                          y1={paddingY24}
                          x2={x}
                          y2={paddingY24 + innerH24}
                          stroke="#1e293b"
                          strokeWidth="1"
                        />
                        <text
                          x={x}
                          y={height24 - 10}
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {hour.timeLabel}
                        </text>
                        <circle cx={x} cy={y} r="3.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                        <text
                          x={x}
                          y={y - 8}
                          fill="#e2e8f0"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          fontFamily="monospace"
                          className="tabular-nums"
                        >
                          {formatTemp(hour.temperature, unit)}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Hourly Strip with Rain Badges */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-2 scrollbar-thin">
            {hourlySubset.map((hour) => (
              <div
                key={`strip-${hour.time}`}
                className="shrink-0 w-20 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center flex flex-col items-center justify-between"
              >
                <span className="text-[11px] text-slate-400 font-medium">{hour.timeLabel}</span>
                <span className="text-sm font-bold text-white font-mono tabular-nums my-1">
                  {formatTemp(hour.temperature, unit)}
                </span>
                <span className="text-[10px] text-blue-400 flex items-center gap-0.5 font-mono tabular-nums">
                  <CloudRain className="w-2.5 h-2.5" />
                  {hour.precipitationProbability}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
