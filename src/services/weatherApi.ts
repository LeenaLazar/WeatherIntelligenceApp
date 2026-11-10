import { GeoLocationResult, WeatherData, DailyForecast, HourlyForecast } from '../types/weather';

export const INITIAL_CITY: GeoLocationResult = {
  id: 1264527,
  name: 'Chennai',
  latitude: 13.0827,
  longitude: 80.2707,
  country: 'India',
  admin1: 'Tamil Nadu',
  country_code: 'IN',
  timezone: 'Asia/Kolkata',
};

export const POPULAR_CITIES: GeoLocationResult[] = [
  INITIAL_CITY,
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    timezone: 'Europe/London',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7143,
    longitude: -74.006,
    country: 'United States',
    admin1: 'New York',
    country_code: 'US',
    timezone: 'America/New_York',
  },
  {
    id: 1880252,
    name: 'Singapore',
    latitude: 1.2897,
    longitude: 103.8501,
    country: 'Singapore',
    country_code: 'SG',
    timezone: 'Asia/Singapore',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    admin1: 'New South Wales',
    country_code: 'AU',
    timezone: 'Australia/Sydney',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    timezone: 'Europe/Paris',
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    country: 'United Arab Emirates',
    country_code: 'AE',
    timezone: 'Asia/Dubai',
  },
];

export async function searchCities(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Geocoding API responded with status ${response.status}`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation,
    country_code: item.country_code,
    country: item.country || 'Unknown',
    admin1: item.admin1,
    admin2: item.admin2,
    admin3: item.admin3,
    timezone: item.timezone,
  }));
}

export async function fetchWeatherData(location: GeoLocationResult): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Open-Meteo Forecast API responded with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.current || !data.daily) {
    throw new Error('Incomplete weather telemetry received from Open-Meteo API.');
  }

  // Format 7 days of daily forecasts
  const daily: DailyForecast[] = (data.daily.time || []).slice(0, 7).map((timeStr: string, idx: number) => {
    const dateObj = new Date(timeStr + 'T12:00:00');
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();

    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const dateLabel = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      date: timeStr,
      dateLabel,
      dayName,
      weatherCode: data.daily.weather_code[idx] ?? 0,
      tempMax: data.daily.temperature_2m_max[idx] ?? 0,
      tempMin: data.daily.temperature_2m_min[idx] ?? 0,
      precipitationSum: data.daily.precipitation_sum ? (data.daily.precipitation_sum[idx] ?? 0) : 0,
      precipitationProbability: data.daily.precipitation_probability_max ? (data.daily.precipitation_probability_max[idx] ?? 0) : 0,
      windSpeedMax: data.daily.wind_speed_10m_max ? (data.daily.wind_speed_10m_max[idx] ?? 0) : 0,
      uvIndexMax: data.daily.uv_index_max ? (data.daily.uv_index_max[idx] ?? 0) : 0,
      sunrise: data.daily.sunrise ? data.daily.sunrise[idx] : undefined,
      sunset: data.daily.sunset ? data.daily.sunset[idx] : undefined,
    };
  });

  // Extract next 24 hours of hourly data starting from current local hour
  const hourly: HourlyForecast[] = [];
  if (data.hourly && Array.isArray(data.hourly.time)) {
    const nowTimeStr = data.current.time; // e.g. "2026-11-10T11:30"
    let startIndex = 0;
    if (nowTimeStr) {
      const matchIdx = data.hourly.time.findIndex((t: string) => t >= nowTimeStr.slice(0, 13));
      if (matchIdx !== -1) {
        startIndex = matchIdx;
      }
    }

    const slice = data.hourly.time.slice(startIndex, startIndex + 24);
    slice.forEach((timeStr: string, relIdx: number) => {
      const absIdx = startIndex + relIdx;
      const dateObj = new Date(timeStr);
      const hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

      hourly.push({
        time: timeStr,
        timeLabel: `${formattedHour} ${ampm}`,
        temperature: data.hourly.temperature_2m[absIdx] ?? 0,
        precipitationProbability: data.hourly.precipitation_probability ? (data.hourly.precipitation_probability[absIdx] ?? 0) : 0,
        weatherCode: data.hourly.weather_code ? (data.hourly.weather_code[absIdx] ?? 0) : 0,
      });
    });
  }

  return {
    location,
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m ?? 0,
      feelsLike: data.current.apparent_temperature ?? data.current.temperature_2m ?? 0,
      humidity: data.current.relative_humidity_2m ?? 0,
      precipitation: data.current.precipitation ?? 0,
      weatherCode: data.current.weather_code ?? 0,
      windSpeed: data.current.wind_speed_10m ?? 0,
      windDirection: data.current.wind_direction_10m ?? 0,
      surfacePressure: data.current.surface_pressure ?? 1013,
      uvIndex: data.current.uv_index ?? 0,
    },
    daily,
    hourly,
    timezone: data.timezone || location.timezone || 'UTC',
    timezoneAbbreviation: data.timezone_abbreviation,
    lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<GeoLocationResult> {
  // Use Open-Meteo reverse geocoding or bigdatacloud / fallback
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        id: Math.round(latitude * 1000 + longitude),
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        latitude,
        longitude,
        country: data.countryName || 'Unknown',
        country_code: data.countryCode,
        admin1: data.principalSubdivision,
      };
    }
  } catch {
    // Fallback if reverse geocoding fails
  }

  return {
    id: Math.round(latitude * 1000 + longitude),
    name: 'Current Coordinates',
    latitude,
    longitude,
    country: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
  };
}
