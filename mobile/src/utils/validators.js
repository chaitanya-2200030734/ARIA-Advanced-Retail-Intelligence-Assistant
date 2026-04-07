/**
 * Validation utilities
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  },

  /**
   * Validate password strength
   */
  password: (password) => {
    return {
      isValid: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      length: password.length,
    }
  },

  /**
   * Validate phone number (Indian format)
   */
  phone: (phone) => {
    const regex = /^[0-9]{10}$/
    return regex.test(phone?.replace(/\D/g, ''))
  },

  /**
   * Validate full name
   */
  name: (name) => {
    return name.trim().length >= 2
  },

  /**
   * Validate product quantity
   */
  quantity: (qty) => {
    return Number.isInteger(qty) && qty > 0 && qty <= 10000
  },

  /**
   * Validate price
   */
  price: (price) => {
    return Number(price) > 0 && Number(price) < 1000000
  },

  /**
   * Get validation error message
   */
  getErrorMessage: (field, value) => {
    switch (field) {
      case 'email':
        return value ? 'Invalid email format' : 'Email is required'
      case 'password':
        return value ? 'Password must be at least 8 characters' : 'Password is required'
      case 'name':
        return value ? 'Name must be at least 2 characters' : 'Name is required'
      case 'phone':
        return 'Phone must be a valid 10-digit number'
      case 'confirm_password':
        return 'Passwords do not match'
      default:
        return 'Invalid input'
    }
  },
}

/**
 * Form field validation
 */
export const validateFormField = (fieldName, value, otherValues = {}) => {
  let error = ''

  switch (fieldName) {
    case 'email':
      if (!value) error = 'Email is required'
      else if (!validators.email(value)) error = 'Invalid email format'
      break

    case 'password':
      if (!value) error = 'Password is required'
      else if (value.length < 8) error = 'Password must be at least 8 characters'
      break

    case 'fullName':
      if (!value) error = 'Full name is required'
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters'
      break

    case 'confirmPassword':
      if (!value) error = 'Confirm password is required'
      else if (value !== otherValues.password) error = 'Passwords do not match'
      break

    case 'phone':
      if (value && !validators.phone(value)) error = 'Invalid phone number'
      break

    case 'quantity':
      if (!value || !validators.quantity(parseInt(value))) error = 'Invalid quantity'
      break

    default:
      break
  }

  return error
}

/**
 * Validate entire form
 */
export const validateForm = (fields, fieldDefinitions) => {
  const errors = {}

  Object.keys(fieldDefinitions).forEach((fieldName) => {
    const error = validateFormField(fieldName, fields[fieldName], fields)
    if (error) {
      errors[fieldName] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
