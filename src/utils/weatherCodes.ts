export interface WeatherCodeInfo {
  code: number;
  label: string;
  description: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudFog' | 'CloudDrizzle' | 'CloudRain' | 'CloudSnow' | 'CloudLightning' | 'Tornado';
  accentColor: string; // Tailwind color class for badges/glows
  bgColor: string;
  borderColor: string;
}

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  // WMO Weather interpretation codes (WW)
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: 'Sunny and completely clear skies',
        iconName: 'Sun',
        accentColor: 'text-amber-400',
        bgColor: 'from-amber-500/10 to-orange-500/5',
        borderColor: 'border-amber-500/20',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Mostly clear with faint cloud cover',
        iconName: 'Sun',
        accentColor: 'text-amber-300',
        bgColor: 'from-amber-400/10 to-yellow-500/5',
        borderColor: 'border-amber-400/20',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periodic sunshine',
        iconName: 'CloudSun',
        accentColor: 'text-sky-300',
        bgColor: 'from-sky-500/10 to-blue-500/5',
        borderColor: 'border-sky-500/20',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Uniform gray cloud layer obscuring the sun',
        iconName: 'Cloud',
        accentColor: 'text-slate-300',
        bgColor: 'from-slate-500/10 to-zinc-500/5',
        borderColor: 'border-slate-500/20',
      };
    case 45:
      return {
        code,
        label: 'Foggy',
        description: 'Dense fog reducing ground visibility',
        iconName: 'CloudFog',
        accentColor: 'text-slate-400',
        bgColor: 'from-slate-600/10 to-zinc-600/5',
        borderColor: 'border-slate-500/20',
      };
    case 48:
      return {
        code,
        label: 'Depositing Rime Fog',
        description: 'Freezing fog coating surfaces with ice crystals',
        iconName: 'CloudFog',
        accentColor: 'text-teal-300',
        bgColor: 'from-teal-500/10 to-slate-600/5',
        borderColor: 'border-teal-500/20',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        description: 'Fine, gentle water droplets falling continuously',
        iconName: 'CloudDrizzle',
        accentColor: 'text-cyan-300',
        bgColor: 'from-cyan-500/10 to-blue-500/5',
        borderColor: 'border-cyan-500/20',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        description: 'Steady misting rain with damp conditions',
        iconName: 'CloudDrizzle',
        accentColor: 'text-cyan-400',
        bgColor: 'from-cyan-500/10 to-blue-600/5',
        borderColor: 'border-cyan-500/20',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        description: 'Thick drizzle significantly wetting surfaces',
        iconName: 'CloudDrizzle',
        accentColor: 'text-blue-400',
        bgColor: 'from-blue-500/10 to-cyan-600/5',
        borderColor: 'border-blue-500/20',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Supercooled drizzle forming thin glaze ice',
        iconName: 'CloudDrizzle',
        accentColor: 'text-indigo-300',
        bgColor: 'from-indigo-500/10 to-cyan-500/5',
        borderColor: 'border-indigo-500/20',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        description: 'Light rainfall with intermittent breaks',
        iconName: 'CloudRain',
        accentColor: 'text-blue-400',
        bgColor: 'from-blue-500/10 to-sky-500/5',
        borderColor: 'border-blue-500/20',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Consistent rainfall and wet ground',
        iconName: 'CloudRain',
        accentColor: 'text-blue-500',
        bgColor: 'from-blue-600/15 to-indigo-600/5',
        borderColor: 'border-blue-500/25',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Substantial downpour with water accumulation',
        iconName: 'CloudRain',
        accentColor: 'text-blue-400',
        bgColor: 'from-blue-600/20 to-slate-800/20',
        borderColor: 'border-blue-500/30',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Rain freezing immediately on ground contact',
        iconName: 'CloudRain',
        accentColor: 'text-cyan-200',
        bgColor: 'from-cyan-600/15 to-blue-700/10',
        borderColor: 'border-cyan-400/20',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow Fall',
        description: 'Gentle snowflakes drifting softly',
        iconName: 'CloudSnow',
        accentColor: 'text-sky-200',
        bgColor: 'from-sky-300/10 to-slate-500/10',
        borderColor: 'border-sky-300/20',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow Fall',
        description: 'Steady snow accumulation on surfaces',
        iconName: 'CloudSnow',
        accentColor: 'text-sky-100',
        bgColor: 'from-sky-400/15 to-slate-400/10',
        borderColor: 'border-sky-300/25',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow Fall',
        description: 'Intense blizzard conditions and deep snowdrifts',
        iconName: 'CloudSnow',
        accentColor: 'text-white',
        bgColor: 'from-slate-200/20 to-sky-600/10',
        borderColor: 'border-slate-300/30',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Tiny opaque ice crystals falling from low stratus',
        iconName: 'CloudSnow',
        accentColor: 'text-sky-200',
        bgColor: 'from-sky-500/10 to-slate-600/10',
        borderColor: 'border-sky-400/20',
      };
    case 80:
      return {
        code,
        label: 'Slight Rain Showers',
        description: 'Brief localized light showers',
        iconName: 'CloudRain',
        accentColor: 'text-blue-400',
        bgColor: 'from-blue-500/10 to-sky-500/10',
        borderColor: 'border-blue-500/20',
      };
    case 81:
      return {
        code,
        label: 'Moderate Rain Showers',
        description: 'Passing heavier rain bursts',
        iconName: 'CloudRain',
        accentColor: 'text-blue-400',
        bgColor: 'from-blue-600/15 to-indigo-600/10',
        borderColor: 'border-blue-500/25',
      };
    case 82:
      return {
        code,
        label: 'Violent Rain Showers',
        description: 'Sudden high-intensity torrential deluge',
        iconName: 'CloudRain',
        accentColor: 'text-indigo-400',
        bgColor: 'from-indigo-600/20 to-slate-800/30',
        borderColor: 'border-indigo-500/30',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Intermittent snow squalls with rapid bursts',
        iconName: 'CloudSnow',
        accentColor: 'text-sky-200',
        bgColor: 'from-sky-400/15 to-slate-700/15',
        borderColor: 'border-sky-400/25',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Active lightning strikes and rolling thunder',
        iconName: 'CloudLightning',
        accentColor: 'text-amber-400',
        bgColor: 'from-amber-600/20 to-purple-900/20',
        borderColor: 'border-amber-500/30',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Thunderstorm with Hail',
        description: 'Violent electrical storm carrying damaging hail pellets',
        iconName: 'CloudLightning',
        accentColor: 'text-amber-300',
        bgColor: 'from-purple-900/25 to-amber-600/20',
        borderColor: 'border-amber-400/35',
      };
    default:
      return {
        code,
        label: 'Fair Weather',
        description: 'Calm atmospheric conditions',
        iconName: 'CloudSun',
        accentColor: 'text-slate-300',
        bgColor: 'from-slate-700/10 to-slate-800/10',
        borderColor: 'border-slate-700/30',
      };
  }
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
}

export function convertCelsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  const value = unit === 'F' ? convertCelsiusToFahrenheit(celsius) : celsius;
  return `${Math.round(value)}°${unit}`;
}
