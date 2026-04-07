/**
 * Color utilities matching frontend Tailwind config
 */
export const COLORS = {
  ink: '#1C1814',
  cream: '#F5F2ED',
  creamDark: '#EDE9E0',
  amber: '#C97B2E',
  amberPale: '#FBF4EB',
  amberLight: '#F4DFC0',
  forest: '#2A4A35',
  forestPale: '#EBF3EE',
  forestLight: '#C8DAD0',
  rust: '#B94E2D',
  rustPale: '#FDF0ED',
  rustLight: '#F5D0C5',
  slate: '#3A5068',
  slatePale: '#EBF1F6',
  slateLight: '#C8D7E3',
  stone: '#8A8278',
  inkLight: '#3D3830',
  border: '#D8D2C8',
}

/**
 * Get color classes dynamically
 * @param {string} colorName - Color name (forest, rust, amber, slate)
 * @returns {object} - Color hex values
 */
export const getColorClasses = (colorName) => {
  const colorMap = {
    forest: { main: COLORS.forest, pale: COLORS.forestPale, light: COLORS.forestLight },
    rust: { main: COLORS.rust, pale: COLORS.rustPale, light: COLORS.rustLight },
    amber: { main: COLORS.amber, pale: COLORS.amberPale, light: COLORS.amberLight },
    slate: { main: COLORS.slate, pale: COLORS.slatePale, light: COLORS.slateLight },
  }
  return colorMap[colorName] || colorMap.slate
}

/**
 * Format currency for INR
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`
}

/**
 * Format date to readable format
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date and time
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  const d = new Date(date)
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get time greeting
 * @returns {string}
 */
export const getTimeGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

/**
 * Calculate percentage
 * @param {number} value
 * @param {number} total
 * @returns {number}
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Truncate text
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password
 * @param {string} password
 * @returns {object}
 */
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    message: password.length < 8 ? 'Password must be at least 8 characters' : 'Password is valid',
  }
}
