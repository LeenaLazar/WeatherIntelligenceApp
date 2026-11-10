export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country_code?: string;
  timezone?: string;
  country: string;
  admin1?: string; // State or province
  admin2?: string; // District
  admin3?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // %
  precipitation: number; // mm
  weatherCode: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  surfacePressure: number; // hPa
  uvIndex: number;
}

export interface DailyForecast {
  date: string; // ISO date 'YYYY-MM-DD'
  dateLabel: string; // 'Nov 10'
  dayName: string; // 'Monday', 'Today'
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number; // mm
  precipitationProbability: number; // %
  windSpeedMax: number; // km/h
  uvIndexMax: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecast {
  time: string; // '2026-11-10T12:00'
  timeLabel: string; // '12 PM'
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface WeatherData {
  location: GeoLocationResult;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  timezone: string;
  timezoneAbbreviation?: string;
  lastUpdated: string;
}

export type RecommendationUrgency = 'essential' | 'advisory' | 'favorable';

export interface WeatherRecommendation {
  id: string;
  category: 'umbrella' | 'clothing' | 'hydration' | 'outdoor' | 'caution';
  title: string;
  message: string;
  urgency: RecommendationUrgency;
  iconName: string;
  triggerMetric: string;
}

export type TempUnit = 'C' | 'F';
