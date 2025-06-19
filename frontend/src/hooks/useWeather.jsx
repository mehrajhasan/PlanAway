import { useState, useEffect } from 'react';

export const useWeather = (lat, lng) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_APIKEY}&q=${lat},${lng}&days=14`
        );
        const data = await res.json();
        const days = data.forecast?.forecastday || [];

        if (days.length === 0) return;

        // get avg temp
        const total = days.reduce((sum, d) => sum + d.day.avgtemp_f, 0);
        const avgTemp = (total / days.length).toFixed(1);

        // most common weather description
        const freqMap = {};
        for (const day of days) {
          const desc = day.day.condition.text;
          freqMap[desc] = (freqMap[desc] || 0) + 1;
        }
        const mostFrequentDesc = Object.entries(freqMap).sort((a, b) => b[1] - a[1])[0][0];

        setWeather({
          temp: avgTemp,
          desc: mostFrequentDesc
        });
      } catch (err) {
        console.error('Weather fetch failed', err);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  return weather;
};
