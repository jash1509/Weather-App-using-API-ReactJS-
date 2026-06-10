/**
 * ErrorMessage Component
 * ──────────────────────
 * Displays user-friendly error messages with a dismiss button.
 *
 * Demonstrates:
 *  - Error Handling: showing descriptive messages for invalid cities
 *  - DOM Manipulation: conditionally rendering error UI
 *
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {Function} props.onDismiss - Callback to dismiss/clear the error
 */
function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-container" id="error-container" role="alert">
      <div className="error-card">
        <span className="error-card__icon" aria-hidden="true">⚠️</span>
        <p className="error-card__text" id="error-message">{message}</p>
        <button
          className="error-card__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
          id="error-dismiss-btn"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
