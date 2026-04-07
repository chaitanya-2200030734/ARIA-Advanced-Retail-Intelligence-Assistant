/**
 * Helper utilities for common operations
 */

/**
 * Check if stock is low
 */
export const isStockLow = (stockQuantity, reorderLevel = 10) => {
  return stockQuantity <= reorderLevel
}

/**
 * Get stock status
 */
export const getStockStatus = (quantity, reorderLevel = 10) => {
  if (quantity === 0) return { status: 'OUT_OF_STOCK', label: 'Out of Stock', color: 'rust' }
  if (quantity <= reorderLevel) return { status: 'LOW', label: 'Low Stock', color: 'rust' }
  return { status: 'OK', label: 'In Stock', color: 'forest' }
}

/**
 * Get revenue trend direction
 */
export const getRevenueTrend = (current, previous) => {
  if (current > previous) return { direction: 'up', percentage: calculateTrendPercentage(current, previous) }
  if (current < previous) return { direction: 'down', percentage: calculateTrendPercentage(previous, current) }
  return { direction: 'stable', percentage: 0 }
}

/**
 * Calculate trend percentage
 */
const calculateTrendPercentage = (current, previous) => {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Get revenue category label
 */
export const getRevenueCategory = (amount) => {
  if (amount > 50000) return 'High'
  if (amount > 20000) return 'Medium'
  return 'Low'
}

/**
 * Get customer lifetime value category
 */
export const getCustomerCategory = (totalSpent) => {
  if (totalSpent > 50000) return 'VIP'
  if (totalSpent > 20000) return 'Regular'
  return 'New'
}

/**
 * Calculate cart summary
 */
export const calculateCartSummary = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.05) // 5% tax
  const total = subtotal + tax

  return {
    subtotal: Math.round(subtotal),
    tax,
    total,
    itemCount: items.length,
    itemQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

/**
 * Filter items by search term
 */
export const searchItems = (items, searchTerm, searchFields = ['name', 'category']) => {
  if (!searchTerm) return items
  const term = searchTerm.toLowerCase()
  return items.filter((item) =>
    searchFields.some((field) => item[field]?.toLowerCase().includes(term))
  )
}

/**
 * Sort items
 */
export const sortItems = (items, sortBy = 'name', order = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }

    return order === 'asc' ? aVal - bVal : bVal - aVal
  })

  return sorted
}

/**
 * Group items by category
 */
export const groupByCategory = (items) => {
  return items.reduce((groups, item) => {
    const category = item.category || 'Uncategorized'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})
}

/**
 * Get unique categories
 */
export const getUniqueCategories = (items) => {
  return ['All', ...new Set(items.map((item) => item.category).filter(Boolean))]
}

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects
 */
export const mergeObjects = (target, source) => {
  return { ...target, ...source }
}

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (arr, key = null) => {
  if (key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()]
  }
  return [...new Set(arr)]
}

/**
 * Wait/Sleep
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
