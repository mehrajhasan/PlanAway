import {
  Sun,
  Cloudy,
  CloudFog,
  CloudDrizzle,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Snowflake
} from 'lucide-react';

export const getWeatherIcon = (condition, size = 20) => {
  const text = condition?.toLowerCase() || '';

  //sunny
  if (text.includes('sunny') || text.includes('clear'))
    return <Sun size={size} color="#f9a825" />;

  //cloudy / overcast
  if (
    text.includes('partly cloudy') ||
    text.includes('overcast') ||
    (text.includes('cloud') && !text.includes('cloudy with thunder'))
  )
    return <Cloudy size={size} color="#5c6b73" />;

  // fog / mist
  if (
    text.includes('mist') ||
    text.includes('fog') ||
    text.includes('freezing fog')
  )
    return <CloudFog size={size} color="#90a4ae" />;

  // thunder/lightning
  if (text.includes('thunder'))
    return <CloudLightning size={size} color="#f57c00" />;

  // heavy/moderate rain
  if (
    text.includes('moderate rain') ||
    text.includes('heavy rain') ||
    text.includes('torrential rain') ||
    text.includes('rain shower') ||
    text.includes('moderate or heavy rain')
  )
    return <CloudRainWind size={size} color="#1565c0" />;

  //light/drizze
  if (
    text.includes('light drizzle') ||
    text.includes('patchy light drizzle') ||
    text.includes('patchy rain') ||
    text.includes('patchy light rain') ||
    text.includes('light rain') ||
    text.includes('light rain shower')
  )
    return <CloudDrizzle size={size} color="#2196f3" />;

  //snow / sleet / ice
  if (
    text.includes('freezing drizzle') ||
    text.includes('freezing rain') ||
    text.includes('sleet') ||
    text.includes('ice pellets') ||
    text.includes('blowing snow') ||
    text.includes('blizzard') ||
    text.includes('snow') ||
    text.includes('showers of ice pellets')
  )
    return <Snowflake size={size} color="#4fc3f7" />;

  //fallback
  return <Cloudy size={size} color="#9e9e9e" />;
};

export default getWeatherIcon;
