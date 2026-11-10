import { CurrentWeather, DailyForecast, WeatherRecommendation } from '../types/weather';

export function generateWeatherRecommendations(
  current: CurrentWeather,
  daily: DailyForecast[]
): WeatherRecommendation[] {
  const recommendations: WeatherRecommendation[] = [];
  const todayForecast = daily[0];

  // 1. Umbrella / Precipitation Recommendation
  const currentPrecip = current.precipitation;
  const todayMaxRainProb = todayForecast ? todayForecast.precipitationProbability : 0;
  const todayRainSum = todayForecast ? todayForecast.precipitationSum : 0;
  const isRainingNow = currentPrecip > 0.1 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(current.weatherCode);

  if (isRainingNow) {
    recommendations.push({
      id: 'rain-active',
      category: 'umbrella',
      title: 'Carry an Umbrella & Rainwear',
      message: `Active precipitation observed (${currentPrecip.toFixed(1)} mm/hr). Keep a compact umbrella handy and wear waterproof footwear.`,
      urgency: 'essential',
      iconName: 'Umbrella',
      triggerMetric: `${currentPrecip.toFixed(1)} mm current rain · Code ${current.weatherCode}`,
    });
  } else if (todayMaxRainProb >= 50 || todayRainSum >= 2.0) {
    recommendations.push({
      id: 'rain-high-prob',
      category: 'umbrella',
      title: 'High Chance of Rain Today',
      message: `Forecast indicates a ${todayMaxRainProb}% probability of precipitation (${todayRainSum.toFixed(1)} mm total expected). Pack an umbrella before leaving.`,
      urgency: 'essential',
      iconName: 'Umbrella',
      triggerMetric: `${todayMaxRainProb}% rain chance · ${todayRainSum.toFixed(1)} mm forecast`,
    });
  } else if (todayMaxRainProb >= 25 || todayRainSum > 0.3) {
    recommendations.push({
      id: 'rain-moderate-prob',
      category: 'umbrella',
      title: 'Scattered Showers Possible',
      message: `Passing showers are possible (${todayMaxRainProb}% chance). A light travel umbrella or water-resistant jacket is recommended.`,
      urgency: 'advisory',
      iconName: 'CloudRain',
      triggerMetric: `${todayMaxRainProb}% rain chance`,
    });
  } else {
    recommendations.push({
      id: 'rain-unlikely',
      category: 'umbrella',
      title: 'Dry Day Ahead',
      message: 'Minimal to zero chance of rain today. You can safely leave heavy umbrellas and rain gear behind.',
      urgency: 'favorable',
      iconName: 'Sun',
      triggerMetric: `${todayMaxRainProb}% rain chance · ${todayRainSum.toFixed(1)} mm`,
    });
  }

  // 2. Temperature & Attire Recommendations
  const temp = current.temperature;
  const feelsLike = current.feelsLike;

  if (temp >= 33 || feelsLike >= 37) {
    recommendations.push({
      id: 'temp-extreme-heat',
      category: 'clothing',
      title: 'Intense Heat Warning',
      message: `Current temperature is ${temp.toFixed(1)}°C (feels like ${feelsLike.toFixed(1)}°C). Wear light, breathable loose-fitting cotton clothing and take breaks in shaded or air-conditioned environments.`,
      urgency: 'essential',
      iconName: 'Shirt',
      triggerMetric: `${temp.toFixed(1)}°C temp · ${feelsLike.toFixed(1)}°C feels-like`,
    });
  } else if (temp >= 28 || feelsLike >= 31) {
    recommendations.push({
      id: 'temp-warm',
      category: 'clothing',
      title: 'Warm & Humid Attire',
      message: `Warm temperature of ${temp.toFixed(1)}°C with ${current.humidity}% humidity. Breathable t-shirts, light fabrics, and open footwear are ideal for comfort.`,
      urgency: 'advisory',
      iconName: 'Shirt',
      triggerMetric: `${temp.toFixed(1)}°C · ${current.humidity}% humidity`,
    });
  } else if (temp >= 19 && temp < 28) {
    recommendations.push({
      id: 'temp-comfortable',
      category: 'clothing',
      title: 'Comfortable Everyday Wear',
      message: `Pleasant ambient temperature at ${temp.toFixed(1)}°C. Standard casual attire, short or long sleeves are comfortable throughout the day.`,
      urgency: 'favorable',
      iconName: 'CheckCircle',
      triggerMetric: `${temp.toFixed(1)}°C pleasant ambient`,
    });
  } else if (temp >= 12 && temp < 19) {
    recommendations.push({
      id: 'temp-mild-cool',
      category: 'clothing',
      title: 'Light Layer or Jacket Recommended',
      message: `Crisp temperature at ${temp.toFixed(1)}°C. Carry a light windbreaker, cardigan, or sweater, especially in morning and evening hours.`,
      urgency: 'advisory',
      iconName: 'Layers',
      triggerMetric: `${temp.toFixed(1)}°C cool air`,
    });
  } else {
    recommendations.push({
      id: 'temp-cold',
      category: 'clothing',
      title: 'Carry a Warm Heavy Jacket',
      message: `Cold conditions at ${temp.toFixed(1)}°C (feels like ${feelsLike.toFixed(1)}°C). Insulated outerwear, fleece, gloves, and warm layering are advised.`,
      urgency: 'essential',
      iconName: 'ShieldAlert',
      triggerMetric: `${temp.toFixed(1)}°C cold air`,
    });
  }

  // 3. Hydration & Solar Exposure Recommendation
  const uv = current.uvIndex;
  if (uv >= 8 || (temp >= 32 && uv >= 6)) {
    recommendations.push({
      id: 'hydration-very-high-uv',
      category: 'hydration',
      title: 'Stay Strongly Hydrated & UV Protected',
      message: `Very high UV Index of ${uv.toFixed(1)} combined with ${temp.toFixed(1)}°C heat. Drink at least 2.5–3 liters of water, apply SPF 50+ sunscreen, and wear UV-blocking sunglasses.`,
      urgency: 'essential',
      iconName: 'Droplets',
      triggerMetric: `UV Index ${uv.toFixed(1)} (Very High) · ${temp.toFixed(1)}°C`,
    });
  } else if (uv >= 5 || temp >= 28) {
    recommendations.push({
      id: 'hydration-moderate-uv',
      category: 'hydration',
      title: 'Maintain Regular Hydration',
      message: `Moderate UV index (${uv.toFixed(1)}) and warm temperatures. Keep a water bottle nearby and apply sunscreen if exposed to direct midday sun.`,
      urgency: 'advisory',
      iconName: 'Droplets',
      triggerMetric: `UV Index ${uv.toFixed(1)} · ${current.humidity}% humidity`,
    });
  } else {
    recommendations.push({
      id: 'hydration-normal',
      category: 'hydration',
      title: 'Mild Solar Exposure',
      message: `UV Index is gentle at ${uv.toFixed(1)}. Maintain standard daily fluid intake (1.5–2L) to stay energized.`,
      urgency: 'favorable',
      iconName: 'Droplets',
      triggerMetric: `UV Index ${uv.toFixed(1)} (Low)`,
    });
  }

  // 4. Outdoor Activities & Environmental Conditions
  const isThunderstorm = [95, 96, 99].includes(current.weatherCode);
  const isHighWind = current.windSpeed >= 35;
  const isDenseFog = [45, 48].includes(current.weatherCode);

  if (isThunderstorm) {
    recommendations.push({
      id: 'outdoor-storm-hazard',
      category: 'caution',
      title: 'Postpone Outdoor Activities',
      message: 'Active thunderstorm or electrical discharge in the area. Seek sturdy indoor shelter immediately; avoid open fields, golf courses, and water bodies.',
      urgency: 'essential',
      iconName: 'Zap',
      triggerMetric: `Thunderstorm Code ${current.weatherCode} · ${current.windSpeed.toFixed(0)} km/h wind`,
    });
  } else if (isHighWind) {
    recommendations.push({
      id: 'outdoor-high-wind',
      category: 'caution',
      title: 'High Wind Advisory',
      message: `Brisk winds at ${current.windSpeed.toFixed(1)} km/h. Exercise caution if cycling, driving high-sided vehicles, or handling lightweight outdoor items.`,
      urgency: 'advisory',
      iconName: 'Wind',
      triggerMetric: `${current.windSpeed.toFixed(1)} km/h wind gusts`,
    });
  } else if (isDenseFog) {
    recommendations.push({
      id: 'outdoor-fog-caution',
      category: 'caution',
      title: 'Reduced Road Visibility',
      message: 'Dense fog present. Use low-beam fog headlights while commuting and maintain extra stopping distance.',
      urgency: 'advisory',
      iconName: 'EyeOff',
      triggerMetric: 'Dense Fog WMO 45/48',
    });
  } else if (temp >= 18 && temp <= 29 && current.windSpeed < 25 && todayMaxRainProb < 25) {
    recommendations.push({
      id: 'outdoor-favorable',
      category: 'outdoor',
      title: 'Outdoor Activities Favourable',
      message: `Excellent outdoor weather! Calm winds (${current.windSpeed.toFixed(0)} km/h), temperate conditions (${temp.toFixed(1)}°C), and clear skies make this ideal for jogging, cycling, or outdoor dining.`,
      urgency: 'favorable',
      iconName: 'Activity',
      triggerMetric: `${temp.toFixed(1)}°C · ${current.windSpeed.toFixed(0)} km/h wind · ${todayMaxRainProb}% rain chance`,
    });
  } else {
    recommendations.push({
      id: 'outdoor-moderate',
      category: 'outdoor',
      title: 'Moderate Outdoor Conditions',
      message: 'Conditions are generally acceptable for outdoor routines. Check the hourly forecast if planning extended outdoor events.',
      urgency: 'advisory',
      iconName: 'Compass',
      triggerMetric: `${temp.toFixed(1)}°C · ${current.windSpeed.toFixed(0)} km/h wind`,
    });
  }

  return recommendations;
}
