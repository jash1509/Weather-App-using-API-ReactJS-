/**
 * LoadingSpinner Component
 * ────────────────────────
 * Displays a loading state with a spinning animation and text.
 * Shown while the weather API request is in progress.
 *
 * Demonstrates:
 *  - Loading state handling during async operations
 */
function LoadingSpinner() {
  return (
    <div className="loading-container" id="loading-container">
      <div className="loading-card">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p className="loading-text">🛰️ Fetching live weather</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
