# Weather Intelligence Dashboard

A modern, responsive Weather Intelligence application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite**, powered directly by the public **Open-Meteo Weather APIs** (no API keys required).

## Features

1. **City Search & Geocoding**
   - Real-time search with autocomplete suggestions powered by the Open-Meteo Geocoding API (`https://geocoding-api.open-meteo.com/v1/search`).
   - Quick-select access to popular global cities (Chennai, Tokyo, London, New York, Singapore, Sydney, Paris, Dubai).
   - "Use Current Location" geolocation integration with reverse-geocoding fallback.
   - Initial city set to **Chennai, India**.

2. **Current Weather & Environmental Telemetry**
   - Current temperature with dynamic Celsius (°C) and Fahrenheit (°F) conversion.
   - Feels-like temperature (`apparent_temperature`).
   - WMO weather condition code interpretation (0–99) with tailored iconography.
   - Atmospheric telemetry grid: Relative Humidity (%), Wind Speed (km/h) with 16-point cardinal compass direction, Precipitation rate (mm/hr), UV Index with safety ratings (Low, Moderate, High, Very High, Extreme), Atmospheric Surface Pressure (hPa), and Sunrise/Sunset times.

3. **Seven-Day Forecast**
   - Day of week and formatted date.
   - WMO weather condition and tailored icons.
   - Maximum and minimum temperatures with normalized weekly temperature spectrum bars.
   - Precipitation probability percentage and maximum wind gust speed.

4. **Weather Intelligence Charts**
   - **7-Day Temperature Spectrum Chart**: SVG line & area chart displaying maximum and minimum temperature curves with interactive hover tooltips and gridlines.
   - **Precipitation Probability Chart**: 7-day bar chart with percentage thresholds (0% to 100%) and 7-day expected cumulative rainfall.
   - **24-Hour Timeline Mode**: High-resolution hourly temperature curve and hourly precipitation chance strip.

5. **Intelligent Data-Driven Recommendations**
   - Derived directly from actual Open-Meteo API data (no invented values):
     - **Umbrella & Rainwear**: Derived from active precipitation and daily rain probabilities.
     - **Clothing & Layering**: Tailored advice for heatwaves, pleasant temperatures, mild cool, or winter cold.
     - **Hydration & Sun Safety**: Triggered by high ambient temperatures and UV Index ratings.
     - **Outdoor Activity Suitability**: Favourable activity indicator when conditions are mild and calm; alerts for thunderstorms, high winds, and dense fog.

6. **Error Handling & Resilience**
   - Graceful feedback for empty search queries and invalid city names.
   - Network failure error boundary with retry triggers.
   - Polished loading skeleton during initial data fetch.
   - Manual refresh capability.

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Technical Architecture
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **APIs**:
  - Open-Meteo Geocoding API
  - Open-Meteo Forecast API
