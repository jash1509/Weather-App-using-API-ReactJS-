import { useState, useRef, useEffect } from 'react';
import { fetchCitySuggestions } from '../services/weatherService';

/**
 * SearchBar Component
 * ───────────────────
 * Renders the search input and button for city lookup.
 * Shows a premium suggestions dropdown when the user focuses or types.
 *
 * @param {Object} props
 * @param {Function} props.onSearch - Callback when the user submits a search
 * @param {boolean} props.isLoading - Whether a search is currently in progress
 */

const CITY_GROUPS = [
  {
    label: 'Popular in India',
    emoji: '🇮🇳',
    cities: [
      { name: 'Mumbai', icon: '🏙️' },
      { name: 'Delhi', icon: '🕌' },
      { name: 'Bangalore', icon: '💻' },
      { name: 'Chennai', icon: '🌊' },
      { name: 'Kolkata', icon: '🌉' },
      { name: 'Hyderabad', icon: '🏰' },
      { name: 'Pune', icon: '🏞️' },
      { name: 'Jaipur', icon: '🏜️' },
      { name: 'Ahmedabad', icon: '🛕' },
      { name: 'Lucknow', icon: '🕌' },
      { name: 'Goa', icon: '🏖️' },
      { name: 'Varanasi', icon: '🪔' },
    ],
  },
  {
    label: 'Gujarat Cities',
    emoji: '🦁',
    cities: [
      { name: 'Ahmedabad', icon: '🛕' },
      { name: 'Surat', icon: '💎' },
      { name: 'Vadodara', icon: '🏛️' },
      { name: 'Rajkot', icon: '🏙️' },
      { name: 'Gandhinagar', icon: '🌳' },
      { name: 'Bhavnagar', icon: '🌊' },
      { name: 'Jamnagar', icon: '🛢️' },
      { name: 'Junagadh', icon: '⛰️' },
      { name: 'Anand', icon: '🥛' },
      { name: 'Navsari', icon: '🌾' },
      { name: 'Valsad', icon: '🥭' },
      { name: 'Vapi', icon: '🏭' },
      { name: 'Bharuch', icon: '🌉' },
      { name: 'Ankleshwar', icon: '⚗️' },
      { name: 'Bhuj', icon: '🏜️' },
      { name: 'Morbi', icon: '🏺' },
      { name: 'Porbandar', icon: '🕊️' },
      { name: 'Dwarka', icon: '🛕' },
      { name: 'Somnath', icon: '🔱' },
      { name: 'Mehsana', icon: '🏢' },
      { name: 'Nadiad', icon: '🏥' },
      { name: 'Amreli', icon: '🚜' },
      { name: 'Surendranagar', icon: '🧶' },
      { name: 'Patan', icon: '🧣' },
      { name: 'Palanpur', icon: '🌸' },
      { name: 'Veraval', icon: '⛵' },
      { name: 'Godhra', icon: '🏘️' },
      { name: 'Dahod', icon: '🛤️' },
    ],
  },
  {
    label: 'Around the World',
    emoji: '🌍',
    cities: [
      { name: 'London', icon: '🎡' },
      { name: 'New York', icon: '🗽' },
      { name: 'Tokyo', icon: '🗼' },
      { name: 'Dubai', icon: '🏗️' },
      { name: 'Paris', icon: '🗼' },
      { name: 'Sydney', icon: '🏖️' },
      { name: 'Singapore', icon: '🌃' },
      { name: 'Toronto', icon: '🍁' },
      { name: 'Bangkok', icon: '🛕' },
      { name: 'Berlin', icon: '🏛️' },
      { name: 'Seoul', icon: '🎎' },
      { name: 'Moscow', icon: '❄️' },
    ],
  },
];

// Flatten for filtering
const ALL_CITIES = CITY_GROUPS.flatMap(g => g.cities);

function SearchBar({ onSearch, isLoading, onFocusChange }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const trimmed = query.trim().toLowerCase();

  // Get filtered local cities
  const localMatches = trimmed.length === 0
    ? []
    : ALL_CITIES.filter(c => c.name.toLowerCase().includes(trimmed))
                .map(c => ({
                  name: c.name,
                  displayName: c.name,
                  icon: c.icon || '📍',
                  isLocal: true
                }));

  // Merge local matches and API matches, avoiding duplicates
  const apiMatchesFiltered = apiSuggestions.filter(apiItem => {
    return !localMatches.some(loc => loc.name.toLowerCase() === apiItem.name.toLowerCase());
  });

  const combinedSuggestions = [
    ...localMatches,
    ...apiMatchesFiltered.map(item => ({
      ...item,
      icon: '📍',
      isLocal: false
    }))
  ];

  // Fetch dynamic city suggestions from OpenWeatherMap Geocoding API (debounced)
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setApiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      try {
        const results = await fetchCitySuggestions(trimmedQuery);
        setApiSuggestions(results);
      } catch (err) {
        console.error('Failed to fetch city suggestions:', err);
      } finally {
        setIsSuggestionsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notify parent of suggestions visibility to hide other screens
  useEffect(() => {
    if (onFocusChange) {
      onFocusChange(showSuggestions && trimmed.length > 0);
    }
    return () => {
      if (onFocusChange) {
        onFocusChange(false);
      }
    };
  }, [showSuggestions, trimmed, onFocusChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Find if we have an exact match in combined suggestions to pass coordinates
      const exactMatch = combinedSuggestions.find(
        c => c.displayName.toLowerCase() === trimmed || c.name.toLowerCase() === trimmed
      );
      if (exactMatch) {
        handleSelect(exactMatch);
      } else {
        onSearch(query.trim());
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
  };

  const handleSelect = (suggestion) => {
    if (typeof suggestion === 'object' && suggestion.lat !== undefined) {
      setQuery(suggestion.displayName || suggestion.name);
      setShowSuggestions(false);
      setActiveIndex(-1);
      onSearch(suggestion); // Pass coordinate object
    } else {
      const cityName = typeof suggestion === 'object' ? suggestion.name : suggestion;
      setQuery(cityName);
      setShowSuggestions(false);
      setActiveIndex(-1);
      onSearch(cityName);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (trimmed.length === 0) {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
      return;
    }

    const items = [...combinedSuggestions];
    const hasExactMatch = combinedSuggestions.some(
      c => c.name.toLowerCase() === trimmed || c.displayName.toLowerCase() === trimmed
    );
    const hasCustom = !hasExactMatch;
    const totalItems = hasCustom ? items.length + 1 : items.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      if (hasCustom && activeIndex === 0) {
        handleSelect(query.trim());
      } else {
        const idx = hasCustom ? activeIndex - 1 : activeIndex;
        if (items[idx]) handleSelect(items[idx]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  // Show filtered results
  const showFilterMode = showSuggestions && trimmed.length > 0;
  const hasExactMatch = combinedSuggestions.some(
    c => c.name.toLowerCase() === trimmed || c.displayName.toLowerCase() === trimmed
  );

  return (
    <div className="search-container" ref={containerRef}>
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="city-search-input"
          className="search-bar__input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Try Mumbai, Delhi, Bangalore, or any city..."
          aria-label="Enter city name"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          autoComplete="off"
          disabled={isLoading}
        />
        <button
          id="search-btn"
          className="search-bar__btn"
          type="submit"
          disabled={isLoading || !query.trim()}
          aria-label="Search weather"
        >
          <span>{isLoading ? '⏳ Fetching...' : '🔎 Search'}</span>
        </button>
      </form>


      {/* ── Filter Mode: Matching results as list ── */}
      {showFilterMode && (
        <div className="suggestions-panel suggestions-panel--compact" role="listbox">
          {/* Custom "Search for X" option */}
          {!hasExactMatch && (
            <button
              className={`suggestions-filter-item suggestions-filter-item--custom ${activeIndex === 0 ? 'suggestions-filter-item--active' : ''}`}
              onMouseDown={() => handleSelect(query.trim())}
              type="button"
            >
              <span className="suggestions-filter-item__icon">🔎</span>
              <span className="suggestions-filter-item__text">
                Search for <strong>"{query.trim()}"</strong>
              </span>
              <span className="suggestions-filter-item__badge">Enter ↵</span>
            </button>
          )}

          {/* Loader */}
          {isSuggestionsLoading && combinedSuggestions.length === 0 && (
            <div className="suggestions-panel__loading">Searching for locations...</div>
          )}

          {/* Filtered list */}
          {combinedSuggestions.length > 0 && (
            <div className="suggestions-panel__divider-label">Matching Locations</div>
          )}
          {combinedSuggestions.map((item, i) => {
            const idx = hasExactMatch ? i : i + 1;
            return (
              <button
                key={item.displayName + '-' + i}
                className={`suggestions-filter-item ${idx === activeIndex ? 'suggestions-filter-item--active' : ''}`}
                onMouseDown={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(idx)}
                type="button"
              >
                <span className="suggestions-filter-item__icon">{item.icon}</span>
                <span className="suggestions-filter-item__text">{highlightMatch(item.displayName, trimmed)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Highlights the matching portion of a city name.
 */
function highlightMatch(name, query) {
  const idx = name.toLowerCase().indexOf(query);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="suggestions-highlight">{name.slice(idx, idx + query.length)}</mark>
      {name.slice(idx + query.length)}
    </>
  );
}

export default SearchBar;
