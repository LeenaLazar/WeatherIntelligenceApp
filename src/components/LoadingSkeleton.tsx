import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center pb-5 border-b border-slate-800/60">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-800 rounded"></div>
            <div className="h-8 w-64 bg-slate-800 rounded"></div>
          </div>
          <div className="h-6 w-24 bg-slate-800 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-slate-800"></div>
            <div className="space-y-2">
              <div className="h-12 w-28 bg-slate-800 rounded"></div>
              <div className="h-5 w-36 bg-slate-800 rounded"></div>
              <div className="h-4 w-48 bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="lg:col-span-7 h-20 bg-slate-800/40 rounded-xl"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-xl p-3"></div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4"></div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 h-72 bg-slate-900/60 border border-slate-800/80 rounded-2xl"></div>
        <div className="lg:col-span-5 h-72 bg-slate-900/60 border border-slate-800/80 rounded-2xl"></div>
      </div>
    </div>
  );
};
