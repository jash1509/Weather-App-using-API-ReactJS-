/**
 * WeatherCard Component
 * ─────────────────────
 * Displays the main weather information including temperature, description,
 * and the weather icon. Also shows city/country info and timestamps.
 *
 * Demonstrates:
 *  - DOM Manipulation: dynamically displaying weather details
 *  - Updating UI based on API response data
 *
 * @param {Object} props
 * @param {Object} props.weather - Formatted weather data object
 */
function WeatherCard({ weather }) {
  const {
    city,
    country,
    temperature,
    feelsLike,
    tempMin,
    tempMax,
    description,
    iconUrl,
    timestamp,
    humidity,
  } = weather;

  // Humidity-based air quality estimate (visual only)
  const aqiPercent = Math.min(humidity, 100);

  return (
    <div className="weather-card" id="weather-card">
      {/* Header: City name + weather icon */}
      <div className="weather-card__header">
        <div className="weather-card__location">
          <h2 className="weather-card__city" id="weather-city">{city}</h2>
          <span className="weather-card__country" id="weather-country">
            📍 {country}
          </span>
          <p className="weather-card__timestamp" id="weather-timestamp">
            {timestamp}
          </p>
        </div>
        <div className="weather-card__icon-container">
          <div className="weather-card__icon-glow" aria-hidden="true"></div>
          <img
            className="weather-card__icon"
            id="weather-icon"
            src={iconUrl}
            alt={description}
            width={110}
            height={110}
          />
        </div>
      </div>

      {/* Temperature & Description */}
      <div className="weather-card__temp-section">
        <div className="weather-card__temp-wrap">
          <span className="weather-card__temp" id="weather-temp">{temperature}</span>
          <span className="weather-card__temp-unit">°C</span>
        </div>
        <div className="weather-card__desc-block">
          <p className="weather-card__description" id="weather-description">
            {description}
          </p>
          <p className="weather-card__feels-like" id="weather-feels-like">
            Feels like {feelsLike}°C
          </p>
          <div className="weather-card__temp-range">
            <span className="weather-card__temp-high" id="weather-high">
              ↑ {tempMax}°
            </span>
            <span className="weather-card__temp-low" id="weather-low">
              ↓ {tempMin}°
            </span>
          </div>
        </div>
      </div>

      {/* Humidity bar as a visual indicator */}
      <div className="weather-card__aqi-row">
        <span className="weather-card__aqi-label">💧 Humidity Level</span>
        <div className="weather-card__aqi-bar">
          <div
            className="weather-card__aqi-fill"
            style={{ width: `${aqiPercent}%` }}
          ></div>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
          {humidity}%
        </span>
      </div>
    </div>
  );
}

export default WeatherCard;
