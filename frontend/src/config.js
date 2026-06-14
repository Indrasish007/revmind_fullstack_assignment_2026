/**
 * Centralized, Immutable Frontend Configuration System
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Log developer warnings in console if the configuration variable is missing
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "[NovaBite Config Warning]: VITE_API_BASE_URL environment variable is missing. " +
    "Defaulting to http://localhost:8000. Ensure your backend server is " +
    "running and configured correctly."
  );
}

const config = {
  apiBaseUrl: API_BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
};

// Freeze object to make it immutable
Object.freeze(config);

export default config;
