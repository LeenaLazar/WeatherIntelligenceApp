import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2, X } from 'lucide-react';
import { GeoLocationResult } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  currentCity: GeoLocationResult | null;
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  onSelectCity: (city: GeoLocationResult) => void;
  onInvalidSearch: (query: string) => void;
  onClearSearch: () => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  searchError: string | null;
  onClearError: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentCity,
  searchTerm,
  onSearchTermChange,
  onSelectCity,
  onInvalidSearch,
  onClearSearch,
  onUseCurrentLocation,
  isLocating,
  searchError,
  onClearError,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      onClearSearch();
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCities(trimmed);
      if (results.length > 0) {
        setSuggestions(results);
        onSelectCity(results[0]);
        setIsOpen(false);
      } else {
        setSuggestions([]);
        setIsOpen(false);
        onInvalidSearch(trimmed);
      }
    } catch {
      setSuggestions([]);
      setIsOpen(false);
      onInvalidSearch(trimmed);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = async (val: string) => {
    onSearchTermChange(val);
    onClearError();
    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchCities(val);
        setSuggestions(results);
        setIsOpen(true);
      } catch {
        // silent search error in dropdown
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
      if (val.trim() === '') {
        onClearSearch();
      }
    }
  };

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    onSearchTermChange(city.name);
    setIsOpen(false);
    onClearError();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Bar */}
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              placeholder="Search any global city (e.g., Chennai, Tokyo, London, San Francisco)..."
              className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 text-white placeholder-slate-400 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm md:text-base shadow-lg transition-all"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  onSearchTermChange('');
                  setSuggestions([]);
                  setIsOpen(false);
                  onClearError();
                  onClearSearch();
                }}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchTerm.trim()}
            className="ml-2.5 px-5 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap shrink-0 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use current geolocation"
            className="ml-2 px-3.5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-sky-400 rounded-xl transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
            aria-label="Use current location"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Autocomplete / Search Results Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-medium text-slate-100 group-hover:text-white">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {searchTerm.trim().length >= 2 ? (
                  <span>No cities found matching "{searchTerm}". Try checking the spelling.</span>
                ) : (
                  <span>Type at least 2 characters to search cities...</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Banner if any */}
      {searchError && (
        <div className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg flex items-center justify-between">
          <span>{searchError}</span>
          <button
            type="button"
            onClick={onClearError}
            className="text-rose-400 hover:text-rose-200 text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Popular Quick-Select Cities */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          Popular Cities:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {POPULAR_CITIES.map((city) => {
            const isSelected = Boolean(currentCity && currentCity.name.toLowerCase() === city.name.toLowerCase());
            return (
              <button
                key={city.name}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-semibold shadow-xs'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
