# VaayuVani वायु वाणी - Real-Time Weather Application

🌬️ **VaayuVani (वायु वाणी) — Voice of the Wind** is a premium, real-time weather application that provides detailed atmospheric metrics with elegant glassmorphic visuals. Built using modern **React 19** and **Vite**, this application offers an immersive user experience tailored to search for weather across popular Indian locations as well as global cities.

---

## ✨ Key Features

*   🌍 **Real-Time Weather Updates**: Fetches live weather statistics from the OpenWeatherMap API, displaying temperature, "feels like" temperature, min/max bounds, humidity, atmospheric pressure, wind velocity, wind direction, cloudiness, visibility, and local sunrise/sunset times.
*   🇮🇳 **India-Centric Presets**: Features popular Indian cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Jaipur) in a dedicated quick-access layout, alongside key global destinations.
*   🔄 **Smart Offline / Simulated Demo Fallback**: Automatically activates a simulated offline mode when API credentials fail, are rate-limited, or when network connectivity is lost. This generates high-fidelity weather metrics for any requested city to ensure uninterrupted functionality.
*   ⚙️ **Custom API Settings Modal**: Includes a developer configuration console to easily save or reset custom OpenWeatherMap API keys directly in `localStorage` without updating the code.
*   ⏰ **Dynamic IST Clock & Calendar**: A live, real-time clock showing India Standard Time (IST) and the current local date right in the header.
*   🎨 **Premium Glassmorphic Design**: Modern dark UI featuring smooth background animations, interactive floating glowing orbs, custom iconography, and responsive layouts built with customized Vanilla CSS.

---

## 🛠️ Technology Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite 8](https://vite.dev/)
*   **Styling**: Custom CSS (utilizing CSS variables, HSL color palettes, responsive flex/grid architectures, and hardware-accelerated animations)
*   **Typography**: Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit) & [Inter](https://fonts.google.com/specimen/Inter))
*   **API**: [OpenWeatherMap API](https://openweathermap.org/api)

---

## 📁 Project Structure

```text
├── public/                  # Static assets (Favicons, branding)
├── src/
│   ├── components/          # Reusable functional React components
│   │   ├── ErrorMessage.jsx # Dynamic error banner with dismiss triggers
│   │   ├── LoadingSpinner.jsx # Animated weather loader
│   │   ├── SearchBar.jsx    # Search input with typing and loading states
│   │   ├── WeatherCard.jsx  # Main temperature and description card
│   │   ├── WeatherDetails.jsx # Comprehensive weather dashboard metrics
│   │   └── WelcomeScreen.jsx # Initial landing display with city suggestion chips
│   ├── services/            # API integration Layer
│   │   └── weatherService.js # Data fetching, formatting, and mock fallback engines
│   ├── App.jsx              # Core application orchestrator, states & settings modal
│   ├── index.css            # Global stylesheets, CSS tokens, animations & overrides
│   └── main.jsx             # React application entry point
├── index.html               # Main HTML shell with SEO meta headers
├── package.json             # NPM dependencies & task configurations
└── vite.config.js           # Vite server settings
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have **Node.js** (v18 or higher recommended) and **npm** installed on your system.

### ⚙️ Installation & Development Setup

1.  **Navigate to the project root directory**:
    ```bash
    cd 4
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the local development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Visit the local server address (usually `http://localhost:5173`) to view and interact with the application.

---

## 🔒 Custom API Key Configuration

By default, the application runs on a pre-configured OpenWeatherMap API key. If the default key encounters rate-limiting or becomes inactive:

1.  Click the settings gear icon (⚙️) at the bottom-right corner of the application.
2.  Input your personal **OpenWeatherMap API Key** (AppID). You can obtain a free key by signing up at [OpenWeatherMap](https://openweathermap.org/).
3.  Click **Save Key**. The application will instantly reload using your custom key.
4.  To restore default settings, open the configuration modal and click **Reset to Default**.
