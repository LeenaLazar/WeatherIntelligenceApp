/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GeoLocationResult, WeatherData, TempUnit } from './types/weather';
import { INITIAL_CITY, fetchWeatherData, reverseGeocode } from './services/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastGrid } from './components/ForecastGrid';
import { WeatherCharts } from './components/WeatherCharts';
import { RecommendationsCard } from './components/RecommendationsCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { NoDataState } from './components/NoDataState';

export default function App() {
  const [city, setCity] = useState<GeoLocationResult | null>(INITIAL_CITY);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [invalidSearchQuery, setInvalidSearchQuery] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');

  // Load weather data for the given location
  const loadWeather = useCallback(async (targetCity: GeoLocationResult, silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await fetchWeatherData(targetCity);
      setWeatherData(data);
      setError(null);
      setInvalidSearchQuery(null);
    } catch (err: any) {
      console.error('Weather data fetch error:', err);
      const userMsg = err?.message?.includes('Failed to fetch')
        ? 'Network error. Please check your internet connection and try again.'
        : err?.message || 'Failed to retrieve weather data from Open-Meteo. Please try again.';
      setError(userMsg);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch initial city (Chennai) on mount
  useEffect(() => {
    loadWeather(INITIAL_CITY);
  }, [loadWeather]);

  // Handle city selection
  const handleSelectCity = (selected: GeoLocationResult) => {
    // If selecting default Chennai, do not display "Chennai" in the search bar
    if (selected.name.toLowerCase() === INITIAL_CITY.name.toLowerCase()) {
      setSearchTerm('');
    }
    setInvalidSearchQuery(null);
    setSearchError(null);
    setCity(selected);
    loadWeather(selected);
  };

  // Handle invalid city search - clears all weather data but preserves typed search term
  const handleInvalidSearch = (query: string) => {
    setWeatherData(null);
    setCity(null);
    setError(null);
    setSearchError(null);
    setInvalidSearchQuery(query || 'Unknown');
    setSearchTerm(query);
  };

  // Reset to default city (Chennai) - clears the search bar so Chennai text is not displayed
  const handleResetDefault = () => {
    setSearchTerm('');
    setInvalidSearchQuery(null);
    setSearchError(null);
    setCity(INITIAL_CITY);
    loadWeather(INITIAL_CITY);
  };

  // Handle clearing the search - restores default city (Chennai)
  const handleClearSearch = () => {
    setSearchTerm('');
    setInvalidSearchQuery(null);
    setSearchError(null);
    if (city?.id !== INITIAL_CITY.id || !weatherData) {
      setCity(INITIAL_CITY);
      loadWeather(INITIAL_CITY);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (city) {
      loadWeather(city, true);
    } else {
      handleResetDefault();
    }
  };

  // Handle browser geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const loc = await reverseGeocode(latitude, longitude);
          setSearchTerm(loc.name);
          setCity(loc);
          await loadWeather(loc);
        } catch {
          setSearchError('Unable to identify your city name from coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setSearchError('Location access was denied. You can search manually for your city.');
        } else {
          setSearchError('Unable to retrieve location coordinates. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        unit={unit}
        onToggleUnit={(newUnit) => setUnit(newUnit)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={weatherData?.lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* City Search Bar & Quick Picks */}
        <SearchBar
          currentCity={city}
          searchTerm={searchTerm}
          onSearchTermChange={(val) => setSearchTerm(val)}
          onSelectCity={handleSelectCity}
          onInvalidSearch={handleInvalidSearch}
          onClearSearch={handleClearSearch}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          searchError={searchError}
          onClearError={() => setSearchError(null)}
        />

        {/* Invalid Search / No Data State: Ensures NO weather data is displayed on invalid search */}
        {invalidSearchQuery !== null && (
          <NoDataState
            query={invalidSearchQuery}
            onResetDefault={handleResetDefault}
            onSelectCity={handleSelectCity}
          />
        )}

        {/* Loading State */}
        {isLoading && !weatherData && invalidSearchQuery === null && <LoadingSkeleton />}

        {/* Error State */}
        {error && !weatherData && invalidSearchQuery === null && (
          <ErrorMessage
            message={error}
            onRetry={() => {
              if (city) loadWeather(city);
              else handleResetDefault();
            }}
            onResetDefault={handleResetDefault}
          />
        )}

        {/* Weather Dashboard Presentation */}
        {weatherData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Real-time Weather Card & Environmental Telemetry */}
            <CurrentWeatherCard weather={weatherData} unit={unit} />

            {/* 7-Day Forecast Grid */}
            <ForecastGrid daily={weatherData.daily} unit={unit} />

            {/* Weather Charts (Temperature Spectrum & Precipitation Probability) */}
            <WeatherCharts
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              unit={unit}
            />

            {/* Data-Driven Recommendations */}
            <RecommendationsCard
              current={weatherData.current}
              daily={weatherData.daily}
            />
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Weather Intelligence · Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              Open-Meteo Public Weather API
            </a>
          </div>
          <div className="font-mono tabular-nums text-slate-400 text-[11px]">
            {weatherData ? `Last synchronized at ${weatherData.lastUpdated} (${weatherData.timezone})` : 'Live Telemetry'}
          </div>
        </div>
      </footer>
    </div>
  );
}
