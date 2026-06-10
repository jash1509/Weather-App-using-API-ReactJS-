/**
 * weatherService.js
 * ─────────────────
 * Handles all weather-related API calls using async/await and the Fetch API.
 * Uses the OpenWeatherMap API (free tier) for real-time weather data.
 *
 * Demonstrates:
 *  - Asynchronous JavaScript (Promises, async/await)
 *  - Fetch API usage
 *  - Comprehensive error handling
 */

const API_KEY = '89e0024e85cf3e63d85e20db0a2e8e2c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetches weather data for a given city name.
 *
 * @param {string} city - The city name to search for
 * @returns {Promise<Object>} - Resolved with formatted weather data
 * @throws {Error} - Throws descriptive errors for various failure modes
 */
export async function fetchWeatherData(city) {
  // Input validation
  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    throw new Error('Please enter a valid city name.');
  }

  const trimmedCity = city.trim();

  // Retrieve custom API key from localStorage if available
  let apiKey = '';
  try {
    apiKey = localStorage.getItem('vaayuvani_api_key') || '';
  } catch (e) {
    console.error('Error reading localStorage:', e);
  }

  if (!apiKey) {
    apiKey = API_KEY;
  }

  // Build the API URL with query parameters
  const url = `${BASE_URL}?q=${encodeURIComponent(trimmedCity)}&appid=${apiKey}&units=metric`;

  try {
    // Make the API request using the Fetch API
    const response = await fetch(url);

    // Parse the JSON response
    const data = await response.json();

    // Handle HTTP error responses from the API
    if (!response.ok) {
      // If it is an authentication error (401), automatically fall back to mock data
      if (response.status === 401) {
        console.warn('API Authentication Error (401). Falling back to mock weather data.');
        return getMockWeatherData(trimmedCity);
      }
      handleApiError(response.status, data);
    }

    // Format and return the weather data
    const formatted = formatWeatherData(data);
    formatted.isDemo = false;
    return formatted;
  } catch (error) {
    // Check if error is network-related or auth-related to use mock data fallback
    const isNetworkError = 
      error.code === 'NETWORK_ERROR' || 
      error.message?.toLowerCase().includes('failed to fetch') ||
      error.message?.toLowerCase().includes('network') ||
      (error.name === 'TypeError' && error.message.includes('fetch'));

    if (error.code === 'AUTH_ERROR' || isNetworkError) {
      console.warn('Authentication or Network error occurred. Falling back to mock weather data.', error);
      return getMockWeatherData(trimmedCity);
    }

    // Re-throw other known errors (like 404 CITY_NOT_FOUND)
    if (error.name === 'WeatherApiError') {
      throw error;
    }

    // Handle any other unexpected errors
    throw createError(
      error.message || 'An unexpected error occurred. Please try again.',
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Handles API-specific error responses and throws user-friendly errors.
 *
 * @param {number} status - HTTP status code
 * @param {Object} data - Parsed API response body
 */
function handleApiError(status, data) {
  switch (status) {
    case 404:
      throw createError(
        `City "${data?.message || 'unknown'}" was not found. Please check the spelling and try again.`,
        'CITY_NOT_FOUND'
      );
    case 401:
      throw createError(
        'API authentication error. Please try again later.',
        'AUTH_ERROR'
      );
    case 429:
      throw createError(
        'Too many requests. Please wait a moment and try again.',
        'RATE_LIMIT'
      );
    case 500:
    case 502:
    case 503:
      throw createError(
        'The weather service is temporarily unavailable. Please try again later.',
        'SERVER_ERROR'
      );
    default:
      throw createError(
        data?.message || `Something went wrong (Error ${status}). Please try again.`,
        'API_ERROR'
      );
  }
}

/**
 * Creates a custom error with a code for programmatic handling.
 *
 * @param {string} message - User-friendly error message
 * @param {string} code - Error code for identification
 * @returns {Error} - Custom error object
 */
function createError(message, code) {
  const error = new Error(message);
  error.name = 'WeatherApiError';
  error.code = code;
  return error;
}

/**
 * Formats raw OpenWeatherMap API data into a clean, usable object.
 *
 * @param {Object} data - Raw API response
 * @returns {Object} - Formatted weather data
 */
function formatWeatherData(data) {
  const {
    name,
    sys,
    main,
    weather,
    wind,
    clouds,
    visibility,
    dt,
    timezone,
  } = data;

  return {
    city: name,
    country: sys?.country || 'N/A',
    temperature: Math.round(main.temp),
    feelsLike: Math.round(main.feels_like),
    tempMin: Math.round(main.temp_min),
    tempMax: Math.round(main.temp_max),
    description: weather[0]?.description || 'N/A',
    icon: weather[0]?.icon || '01d',
    iconUrl: `https://openweathermap.org/img/wn/${weather[0]?.icon || '01d'}@4x.png`,
    humidity: main.humidity,
    pressure: main.pressure,
    windSpeed: wind?.speed || 0,
    windDeg: wind?.deg || 0,
    cloudiness: clouds?.all || 0,
    visibility: visibility ? (visibility / 1000).toFixed(1) : 'N/A',
    sunrise: formatTime(sys?.sunrise, timezone),
    sunset: formatTime(sys?.sunset, timezone),
    timestamp: new Date((dt + timezone) * 1000).toUTCString().replace(' GMT', ''),
  };
}

/**
 * Converts a UNIX timestamp to a readable local time string.
 *
 * @param {number} unixTimestamp - UNIX timestamp in seconds
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @returns {string} - Formatted time string (HH:MM AM/PM)
 */
function formatTime(unixTimestamp, timezoneOffset) {
  if (!unixTimestamp) return 'N/A';

  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Generates realistic mock weather data for any requested city when API key fails.
 *
 * @param {string} city - The city name
 * @returns {Object} - Formatted weather data structure
 */
export function getMockWeatherData(city) {
  const cityName = city.trim();
  const lowerCity = cityName.toLowerCase();
  
  // Base weather templates for standard cities
  const templates = {
    mumbai: { temp: 31, feels: 36, desc: 'passing showers', icon: '09d', humidity: 82, wind: 5.5, pressure: 1008, clouds: 75, sunrise: '06:01 AM', sunset: '07:12 PM', country: 'IN' },
    delhi: { temp: 38, feels: 42, desc: 'haze', icon: '50d', humidity: 45, wind: 3.2, pressure: 1004, clouds: 20, sunrise: '05:24 AM', sunset: '07:15 PM', country: 'IN' },
    bangalore: { temp: 26, feels: 27, desc: 'scattered clouds', icon: '03d', humidity: 62, wind: 6.8, pressure: 1012, clouds: 40, sunrise: '05:54 AM', sunset: '06:44 PM', country: 'IN' },
    chennai: { temp: 34, feels: 39, desc: 'broken clouds', icon: '04d', humidity: 75, wind: 4.5, pressure: 1009, clouds: 60, sunrise: '05:48 AM', sunset: '06:38 PM', country: 'IN' },
    kolkata: { temp: 33, feels: 38, desc: 'moderate rain', icon: '10d', humidity: 80, wind: 3.8, pressure: 1006, clouds: 90, sunrise: '04:59 AM', sunset: '06:18 PM', country: 'IN' },
    hyderabad: { temp: 32, feels: 35, desc: 'few clouds', icon: '02d', humidity: 55, wind: 4.1, pressure: 1010, clouds: 25, sunrise: '05:43 AM', sunset: '06:49 PM', country: 'IN' },
    pune: { temp: 29, feels: 31, desc: 'light rain', icon: '10d', humidity: 70, wind: 5.1, pressure: 1011, clouds: 80, sunrise: '05:58 AM', sunset: '07:07 PM', country: 'IN' },
    jaipur: { temp: 39, feels: 41, desc: 'clear sky', icon: '01d', humidity: 30, wind: 3.5, pressure: 1005, clouds: 5, sunrise: '05:32 AM', sunset: '07:19 PM', country: 'IN' },
    london: { temp: 16, feels: 15, desc: 'light intensity drizzle', icon: '09d', humidity: 88, wind: 4.6, pressure: 1015, clouds: 90, sunrise: '04:48 AM', sunset: '09:08 PM', country: 'GB' },
    'new york': { temp: 22, feels: 22, desc: 'few clouds', icon: '02d', humidity: 60, wind: 3.6, pressure: 1013, clouds: 30, sunrise: '05:28 AM', sunset: '08:20 PM', country: 'US' },
    tokyo: { temp: 24, feels: 24, desc: 'clear sky', icon: '01d', humidity: 65, wind: 2.5, pressure: 1016, clouds: 10, sunrise: '04:29 AM', sunset: '06:48 PM', country: 'JP' },
    dubai: { temp: 41, feels: 46, desc: 'clear sky', icon: '01d', humidity: 35, wind: 4.8, pressure: 1007, clouds: 0, sunrise: '05:29 AM', sunset: '07:08 PM', country: 'AE' },
    sydney: { temp: 18, feels: 18, desc: 'mostly sunny', icon: '01d', humidity: 70, wind: 5.2, pressure: 1022, clouds: 15, sunrise: '06:45 AM', sunset: '04:58 PM', country: 'AU' },
    paris: { temp: 19, feels: 19, desc: 'scattered clouds', icon: '03d', humidity: 68, wind: 3.1, pressure: 1014, clouds: 40, sunrise: '05:50 AM', sunset: '09:40 PM', country: 'FR' },
  };

  const matched = templates[lowerCity];
  if (matched) {
    return {
      city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
      country: matched.country,
      temperature: matched.temp,
      feelsLike: matched.feels,
      tempMin: matched.temp - 2,
      tempMax: matched.temp + 2,
      description: matched.desc,
      icon: matched.icon,
      iconUrl: `https://openweathermap.org/img/wn/${matched.icon}@4x.png`,
      humidity: matched.humidity,
      pressure: matched.pressure,
      windSpeed: matched.wind,
      windDeg: 240,
      cloudiness: matched.clouds,
      visibility: '10.0',
      sunrise: matched.sunrise,
      sunset: matched.sunset,
      timestamp: new Date().toUTCString().replace(' GMT', '') + ' (Simulated)',
      isDemo: true
    };
  }

  // Deterministic mock data generator based on city name string hash
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const absHash = Math.abs(hash);
  const temp = 15 + (absHash % 25); // 15 to 40
  const humidity = 30 + (absHash % 60); // 30 to 90
  const windSpeed = (1 + (absHash % 120) / 10).toFixed(1); // 1.0 to 13.0
  const pressure = 1000 + (absHash % 25); // 1000 to 1025
  const clouds = absHash % 100;
  
  // Decide weather condition based on hash
  const conditions = [
    { desc: 'clear sky', icon: '01d' },
    { desc: 'few clouds', icon: '02d' },
    { desc: 'scattered clouds', icon: '03d' },
    { desc: 'broken clouds', icon: '04d' },
    { desc: 'shower rain', icon: '09d' },
    { desc: 'rain', icon: '10d' },
    { desc: 'thunderstorm', icon: '11d' },
    { desc: 'mist', icon: '50d' },
  ];
  const selectedCond = conditions[absHash % conditions.length];

  return {
    city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
    country: absHash % 2 === 0 ? 'IN' : 'US',
    temperature: temp,
    feelsLike: temp + (humidity > 60 ? 3 : -1),
    tempMin: temp - 3,
    tempMax: temp + 3,
    description: selectedCond.desc,
    icon: selectedCond.icon,
    iconUrl: `https://openweathermap.org/img/wn/${selectedCond.icon}@4x.png`,
    humidity: humidity,
    pressure: pressure,
    windSpeed: parseFloat(windSpeed),
    windDeg: absHash % 360,
    cloudiness: clouds,
    visibility: (5 + (absHash % 6)).toFixed(1),
    sunrise: '05:45 AM',
    sunset: '07:05 PM',
    timestamp: new Date().toUTCString().replace(' GMT', '') + ' (Simulated)',
    isDemo: true
  };
}
