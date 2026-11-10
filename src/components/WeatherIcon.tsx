import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Umbrella,
  Thermometer,
  Droplets,
  Layers,
  Shirt,
  ShieldAlert,
  Zap,
  Activity,
  Compass,
  CheckCircle,
  EyeOff,
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/weatherCodes';

interface WeatherIconProps {
  code?: number;
  iconName?: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  iconName,
  className = 'w-6 h-6',
  size,
}) => {
  const resolvedName = iconName || (code !== undefined ? getWeatherCodeInfo(code).iconName : 'Sun');

  const props = {
    className,
    size,
    strokeWidth: 1.8,
  };

  switch (resolvedName) {
    case 'Sun':
      return <Sun {...props} />;
    case 'CloudSun':
      return <CloudSun {...props} />;
    case 'Cloud':
      return <Cloud {...props} />;
    case 'CloudFog':
      return <CloudFog {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} />;
    case 'CloudRain':
      return <CloudRain {...props} />;
    case 'CloudSnow':
      return <CloudSnow {...props} />;
    case 'CloudLightning':
      return <CloudLightning {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Umbrella':
      return <Umbrella {...props} />;
    case 'Thermometer':
      return <Thermometer {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Shirt':
      return <Shirt {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'CheckCircle':
      return <CheckCircle {...props} />;
    case 'EyeOff':
      return <EyeOff {...props} />;
    default:
      return <CloudSun {...props} />;
  }
};
