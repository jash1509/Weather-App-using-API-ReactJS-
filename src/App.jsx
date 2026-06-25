import { useState, useEffect } from 'react';
import { fetchWeatherData } from './services/weatherService';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import ErrorMessage from './components/ErrorMessage';
import LoadingSpinner from './components/LoadingSpinner';
import WelcomeScreen from './components/WelcomeScreen';

/**
 * App Component - Root of the VaayuVani Weather App
 * ────────────────────────────────────────────────────
 * Manages the overall application state and orchestrates child components.
 *
 * State management:
 *  - weatherData: stores the fetched & formatted weather info
 *  - isLoading: tracks whether an API call is in progress
 *  - error: holds any error message to display
 *
 * Demonstrates:
 *  - Asynchronous JavaScript (async/await with Promises)
 *  - Fetch API (via weatherService)
 *  - DOM Manipulation (dynamic UI updates based on state)
 *  - Error Handling (user-friendly messages for failures)
 */
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Developer settings / API key states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    try {
      return localStorage.getItem('vaayuvani_api_key') || '';
    } catch {
      return '';
    }
  });

  // Live IST clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const istTime = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toLowerCase();

  const istDateText = time.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const istYearText = time.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  });

  /**
   * Handles the weather search.
   * Uses async/await to fetch data and updates the UI state accordingly.
   *
   * @param {string} city - City name to search for
   */
  const handleSearch = async (city) => {
    // Clear previous state
    setError(null);
    setIsLoading(true);
    setWeatherData(null);

    try {
      // Await the async API call (demonstrates async/await with Promises)
      const data = await fetchWeatherData(city);

      // Update the DOM with the new weather data
      setWeatherData(data);
    } catch (err) {
      // Handle errors and display user-friendly messages
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      // Always stop the loading state
      setIsLoading(false);
    }
  };

  /**
   * Clears the current error message.
   */
  const dismissError = () => {
    setError(null);
  };

  /**
   * Saves the custom API key in localStorage and refreshes the current search.
   */
  const saveApiKey = (newKey) => {
    try {
      localStorage.setItem('vaayuvani_api_key', newKey.trim());
      setCustomApiKey(newKey.trim());
      setIsSettingsOpen(false);
      if (weatherData) {
        if (weatherData.lat !== undefined && weatherData.lon !== undefined) {
          handleSearch({
            name: weatherData.city.split(',')[0],
            displayName: weatherData.city,
            lat: weatherData.lat,
            lon: weatherData.lon
          });
        } else {
          handleSearch(weatherData.city);
        }
      }
    } catch (e) {
      console.error('Error saving API key:', e);
    }
  };

  /**
   * Removes custom API key from localStorage and refreshes the current search.
   */
  const resetApiKey = () => {
    try {
      localStorage.removeItem('vaayuvani_api_key');
      setCustomApiKey('');
      setIsSettingsOpen(false);
      if (weatherData) {
        if (weatherData.lat !== undefined && weatherData.lon !== undefined) {
          handleSearch({
            name: weatherData.city.split(',')[0],
            displayName: weatherData.city,
            lat: weatherData.lat,
            lon: weatherData.lon
          });
        } else {
          handleSearch(weatherData.city);
        }
      }
    } catch (e) {
      console.error('Error resetting API key:', e);
    }
  };

  return (
    <div className={`app-container ${weatherData ? 'has-weather' : ''}`}>
      {/* Animated background layers */}
      <div className="bg-gradient-layer" aria-hidden="true"></div>
      <div className="floating-orb floating-orb--1" aria-hidden="true"></div>
      <div className="floating-orb floating-orb--2" aria-hidden="true"></div>
      <div className="floating-orb floating-orb--3" aria-hidden="true"></div>

      {/* Main content */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          {weatherData && (
            <button 
              className="header__back-btn" 
              onClick={() => {
                setWeatherData(null);
                setError(null);
              }}
              aria-label="Back to home screen"
              title="Go to Home Screen"
            >
              <span className="back-icon">🏠</span>
              <span className="back-text">Home</span>
            </button>
          )}
          <div className="header__badge">Made in India • भारत में बनाया गया</div>
          <div className="header__logo-wrap">
            <span className="header__logo" aria-hidden="true">🌬️</span>
          </div>
          <h1 className="header__title">VaayuVani</h1>
          <p className="header__subtitle">
            वायु वाणी — <em>Voice of the Wind</em>
          </p>
          {/* Live IST clock */}
          <div className="header__clock" aria-label="Current India Standard Time">
            <div className="header__clock-left">
              <span className="header__clock-time">{istTime}</span>
              <span className="header__clock-tz">IST</span>
            </div>
            <div className="header__clock-right">
              <span className="header__clock-date">{istDateText}</span>
              <span className="header__clock-year">{istYearText}</span>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} onFocusChange={setIsSearchActive} />

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} onDismiss={dismissError} />
        )}



        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Weather Results */}
        {weatherData && !isLoading && (
          <div className="weather-result">
            <WeatherCard weather={weatherData} />
            <WeatherDetails weather={weatherData} />
          </div>
        )}

        {/* Welcome Screen (shown when no data, no loading, no error, and search suggestions are not showing) */}
        {!weatherData && !isLoading && !error && !isSearchActive && (
          <WelcomeScreen onCitySelect={handleSearch} />
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            Powered by{' '}
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenWeatherMap API
            </a>{' '}
            • Built with React
          </p>
          <div className="footer__made">
            VaayuVani वायु वाणी — Made with <span>♥</span> in India 🇮🇳
          </div>
        </footer>
      </main>

      {/* Settings gear toggle button */}
      <button 
        className="settings-toggle-btn" 
        onClick={() => setIsSettingsOpen(true)}
        aria-label="Open developer settings"
        title="API Settings"
      >
        ⚙️
      </button>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal__header">
              <span className="settings-modal__icon">⚙️</span>
              <h3 className="settings-modal__title">Developer Settings</h3>
              <button className="settings-modal__close" onClick={() => setIsSettingsOpen(false)}>✕</button>
            </div>
            
            <div className="settings-modal__body">
              <p className="settings-modal__text">
                VaayuVani uses the <strong>OpenWeatherMap API</strong> for live weather data. 
                If the default API key is rate-limited or inactive, you can supply your own personal key.
              </p>

              <div className="settings-field">
                <label className="settings-field__label" htmlFor="api-key-input">
                  OpenWeatherMap API Key (appid)
                </label>
                <input
                  id="api-key-input"
                  type="text"
                  className="settings-field__input"
                  placeholder="Paste your 32-character API key here..."
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                />
                <span className="settings-field__help">
                  Get a free API key by signing up at <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">openweathermap.org</a>.
                </span>
              </div>

              <div className="settings-status">
                <span className="settings-status__dot" style={{ backgroundColor: localStorage.getItem('vaayuvani_api_key') ? 'var(--india-green-light)' : 'var(--saffron)' }}></span>
                <span className="settings-status__text">
                  Status: {localStorage.getItem('vaayuvani_api_key') ? 'Using custom API key' : 'Using default fallback key (Simulated fallback enabled)'}
                </span>
              </div>
            </div>

            <div className="settings-modal__actions">
              {localStorage.getItem('vaayuvani_api_key') && (
                <button className="settings-btn settings-btn--reset" onClick={resetApiKey}>
                  Reset to Default
                </button>
              )}
              <div style={{ flexGrow: 1 }} />
              <button className="settings-btn settings-btn--cancel" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </button>
              <button className="settings-btn settings-btn--save" onClick={() => saveApiKey(customApiKey)}>
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
