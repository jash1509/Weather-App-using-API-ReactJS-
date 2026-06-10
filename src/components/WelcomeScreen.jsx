/**
 * WelcomeScreen Component
 * ───────────────────────
 * Displays the initial welcome state with suggested cities.
 * Users can click on suggestion chips to quickly search popular cities.
 * Features Indian cities prominently for India-specific experience.
 *
 * @param {Object} props
 * @param {Function} props.onCitySelect - Callback when a suggested city is clicked
 */
function WelcomeScreen({ onCitySelect }) {
  const globalCities = [
    { name: 'London',   emoji: '🇬🇧' },
    { name: 'New York', emoji: '🇺🇸' },
    { name: 'Tokyo',    emoji: '🇯🇵' },
    { name: 'Dubai',    emoji: '🇦🇪' },
    { name: 'Sydney',   emoji: '🇦🇺' },
    { name: 'Paris',    emoji: '🇫🇷' },
  ];

  const indianCities = [
    { name: 'Mumbai',    emoji: '🌊' },
    { name: 'Delhi',     emoji: '🏛️' },
    { name: 'Bangalore', emoji: '💻' },
    { name: 'Chennai',   emoji: '🌴' },
    { name: 'Kolkata',   emoji: '🎨' },
    { name: 'Hyderabad', emoji: '💎' },
    { name: 'Pune',      emoji: '📚' },
    { name: 'Jaipur',    emoji: '🏰' },
  ];

  return (
    <div className="welcome-container" id="welcome-screen">
      <div className="welcome-card">
        <span className="welcome-card__illustration" aria-hidden="true">🌤️</span>

        <h2 className="welcome-card__title">Discover Live Weather</h2>
        <p className="welcome-card__text">
          Search any city across India or the world to get real-time weather data —
          temperature, humidity, wind speed, sunrise, and much more.
        </p>

        {/* India Cities */}
        <div className="welcome-card__india-title">
          Popular Indian Cities
        </div>
        <div className="welcome-card__india-cities">
          {indianCities.map((city) => (
            <button
              className="india-chip"
              key={city.name}
              id={`india-city-${city.name.toLowerCase()}`}
              onClick={() => onCitySelect(city.name)}
            >
              <span>{city.emoji}</span>
              {city.name}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="welcome-card__divider" style={{ marginTop: '28px' }}>
          <span>Global Cities</span>
        </div>

        {/* Global Cities */}
        <div className="welcome-card__suggestions">
          {globalCities.map((city) => (
            <button
              className="suggestion-chip"
              key={city.name}
              id={`suggestion-${city.name.toLowerCase().replace(' ', '-')}`}
              onClick={() => onCitySelect(city.name)}
            >
              <span>{city.emoji}</span>
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
