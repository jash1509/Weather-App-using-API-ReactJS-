/**
 * WeatherDetails Component
 * ────────────────────────
 * Renders a grid of weather detail tiles (humidity, wind, pressure, etc.).
 * Each tile is displayed dynamically based on the API response data.
 *
 * Demonstrates:
 *  - DOM Manipulation: dynamically creating detail tiles
 *  - Updating the UI based on API response data
 *
 * @param {Object} props
 * @param {Object} props.weather - Formatted weather data object
 */
function WeatherDetails({ weather }) {
  const {
    humidity,
    pressure,
    windSpeed,
    windDeg,
    cloudiness,
    visibility,
    sunrise,
    sunset,
  } = weather;

  /**
   * Converts wind degree to a cardinal direction string.
   * @param {number} deg - Wind direction in degrees
   * @returns {string} - Cardinal direction (e.g., "N", "NE", "E")
   */
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // Define all detail tiles dynamically from the data
  const detailItems = [
    {
      id: 'detail-humidity',
      icon: '💧',
      label: 'Humidity',
      value: `${humidity}%`,
      sub: humidity > 70 ? 'High moisture' : humidity < 30 ? 'Very dry' : 'Comfortable',
    },
    {
      id: 'detail-wind',
      icon: '💨',
      label: 'Wind',
      value: `${windSpeed} m/s`,
      sub: `Direction: ${getWindDirection(windDeg)}`,
    },
    {
      id: 'detail-pressure',
      icon: '🌡️',
      label: 'Pressure',
      value: `${pressure}`,
      sub: 'hPa',
    },
    {
      id: 'detail-clouds',
      icon: '☁️',
      label: 'Cloudiness',
      value: `${cloudiness}%`,
      sub: cloudiness > 75 ? 'Overcast' : cloudiness > 25 ? 'Partly cloudy' : 'Clear skies',
    },
    {
      id: 'detail-visibility',
      icon: '👁️',
      label: 'Visibility',
      value: `${visibility} km`,
      sub: visibility >= 10 ? 'Crystal clear' : visibility >= 5 ? 'Moderate' : 'Low visibility',
    },
    {
      id: 'detail-sunrise',
      icon: '🌅',
      label: 'Sunrise',
      value: sunrise,
      sub: 'Local time',
    },
    {
      id: 'detail-sunset',
      icon: '🌇',
      label: 'Sunset',
      value: sunset,
      sub: 'Local time',
    },
  ];

  return (
    <div className="weather-details" id="weather-details-grid">
      {detailItems.map((item) => (
        <div className="detail-tile" key={item.id} id={item.id}>
          <div className="detail-tile__header">
            <span className="detail-tile__icon" aria-hidden="true">{item.icon}</span>
            <span className="detail-tile__label">{item.label}</span>
          </div>
          <div className="detail-tile__value">{item.value}</div>
          <div className="detail-tile__sub">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}

export default WeatherDetails;
