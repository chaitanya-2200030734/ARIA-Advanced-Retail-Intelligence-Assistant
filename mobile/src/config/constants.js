// Development and Configuration Constants

// IMPORTANT: Update this IP address to your backend machine's local IP
// Run "ipconfig" on Windows or "ifconfig" on Mac/Linux to find your IP
// Replace 192.168.x.x with your actual local IP address
const BACKEND_IP = '192.168.100.119' // Your machine's IP — run "ipconfig" to confirm
const BACKEND_PORT = '5000'

const ENV = {
  dev: {
    apiUrl: `http://${BACKEND_IP}:${BACKEND_PORT}/api`,
    enableLogging: true,
    enableNetworkLogging: true,
  },
  prod: {
    apiUrl: 'http://aria-retail-api.example.com/api', // Update with production URL
    enableLogging: false,
    enableNetworkLogging: false,
  },
}

const getEnvVars = () => {
  // In development, return dev config
  // In production, return prod config
  if (__DEV__) {
    return ENV.dev
  }
  return ENV.prod
}

export default getEnvVars()

// Color Scheme - ARIA Retail
export const COLORS = {
  primary: '#C97B2E',      // Amber
  dark: '#1C1814',          // Ink
  light: '#F5F2ED',         // Cream
  accent: '#2A4A35',        // Forest
  alert: '#B94E2D',         // Rust
  border: '#D8D2C8',        // Border
  secondary: '#8A8278',     // Stone
  background: '#EDE9E0',    // Light background
  success: '#2A4A35',       // Forest
  warning: '#C97B2E',       // Amber
  error: '#B94E2D',         // Rust
}

// Admin Badges
export const ADMIN_BADGE = {
  color: '#2A4A35',
  backgroundColor: '#EBF3EE',
}

// User Shopping Defaults
export const SHOPPING_DEFAULTS = {
  defaultCategory: 'All',
  itemsPerPage: 10,
  freeShippingThreshold: 0, // Free shipping on all orders
}

// Chat Configuration
export const CHAT_CONFIG = {
  maxHistoryLength: 20,
  responseTimeoutMs: 30000,
}

// Storage Keys for AsyncStorage
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userRole: 'user_role',
  userEmail: 'user_email',
  cart: 'cart',
  userPreferences: 'user_preferences',
}
