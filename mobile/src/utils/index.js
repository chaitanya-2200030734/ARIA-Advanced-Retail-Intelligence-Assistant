/**
 * Central export for all utilities
 */

export * from './formatters'
export * from './validators'
export * from './helpers'

// Re-export commonly used functions
export {
  COLORS,
  getColorClasses,
  formatCurrency,
  formatDate,
  formatDateTime,
  getTimeGreeting,
  calculatePercentage,
  truncateText,
  isValidEmail,
  validatePassword,
} from './formatters'

export {
  validators,
  validateFormField,
  validateForm,
} from './validators'

export {
  isStockLow,
  getStockStatus,
  getRevenueTrend,
  getRevenueCategory,
  getCustomerCategory,
  calculateCartSummary,
  searchItems,
  sortItems,
  groupByCategory,
  getUniqueCategories,
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  removeDuplicates,
  sleep,
} from './helpers'
