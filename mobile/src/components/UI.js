import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

/**
 * COLOR SYSTEM - Matches Frontend Tailwind Config
 */
export const ARIA_COLORS = {
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
  border: '#D8D2C8',
}

/**
 * BUTTON Component - Primary, Secondary, Danger variants
 * Matches frontend design
 */
export const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  disabled = false, 
  style,
  icon = null,
  loading = false 
}) => {
  const variants = {
    primary: {
      backgroundColor: ARIA_COLORS.amber,
      color: '#FFFFFF',
      borderColor: ARIA_COLORS.amber,
    },
    secondary: {
      backgroundColor: ARIA_COLORS.creamDark,
      color: ARIA_COLORS.ink,
      borderColor: ARIA_COLORS.border,
    },
    danger: {
      backgroundColor: ARIA_COLORS.rust,
      color: '#FFFFFF',
      borderColor: ARIA_COLORS.rust,
    },
    outline: {
      backgroundColor: 'transparent',
      color: ARIA_COLORS.amber,
      borderColor: ARIA_COLORS.amber,
    },
  }

  const buttonStyle = variants[variant]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: buttonStyle.backgroundColor,
          borderColor: buttonStyle.borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <Text style={[styles.buttonText, { color: buttonStyle.color }]}>...</Text>
      ) : (
        <View style={styles.buttonContent}>
          {icon && <MaterialIcons name={icon} size={18} color={buttonStyle.color} style={{ marginRight: 8 }} />}
          <Text style={[styles.buttonText, { color: buttonStyle.color }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

/**
 * INPUT Component - Text input with label and error
 * Matches frontend design
 */
export const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  style,
  label = null,
  error = null,
  icon = null,
  editable = true,
  multiline = false,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        { borderColor: error ? ARIA_COLORS.rust : ARIA_COLORS.border }
      ]}>
        {icon && <MaterialIcons name={icon} size={20} color={ARIA_COLORS.stone} />}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          placeholderTextColor={ARIA_COLORS.stone}
          style={[styles.inputText, { marginLeft: icon ? 8 : 0 }]}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  )
}

/**
 * CARD Component - Basic white container
 * Matches frontend design
 */
export const Card = ({ children, style, onPress = null, shadow = true }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.card,
        shadow && styles.cardShadow,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  )
}

/**
 * STAT CARD Component - Shows label and value
 * Matches frontend design (forest, rust, amber, slate)
 */
export const StatCard = ({ label, value, color = 'amber', suffix = '', icon = null }) => {
  const colorMap = {
    amber: ARIA_COLORS.amber,
    forest: ARIA_COLORS.forest,
    rust: ARIA_COLORS.rust,
    slate: ARIA_COLORS.slate,
  }

  return (
    <Card style={styles.statCard}>
      <View style={styles.statHeader}>
        <View>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={[styles.statValue, { color: colorMap[color] }]}>
            {value}
            {suffix && <Text style={{ fontSize: 16 }}>{suffix}</Text>}
          </Text>
        </View>
        {icon && <View>{icon}</View>}
      </View>
    </Card>
  )
}

/**
 * BADGE Component - Status badges
 * OK (forest), LOW (rust), etc.
 */
export const Badge = ({ status = 'OK', label = '' }) => {
  const statusConfig = {
    OK: {
      backgroundColor: ARIA_COLORS.forestPale,
      color: ARIA_COLORS.forest,
      borderColor: ARIA_COLORS.forestLight,
    },
    LOW: {
      backgroundColor: ARIA_COLORS.rustPale,
      color: ARIA_COLORS.rust,
      borderColor: ARIA_COLORS.rustLight,
    },
    DEFAULT: {
      backgroundColor: ARIA_COLORS.slatePale,
      color: ARIA_COLORS.slate,
      borderColor: ARIA_COLORS.slateLight,
    },
  }

  const config = statusConfig[status] || statusConfig.DEFAULT

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: config.color }]}>
        {label || status}
      </Text>
    </View>
  )
}

/**
 * DIVIDER Component
 */
export const Divider = ({ style = null }) => {
  return <View style={[styles.divider, style]} />
}

/**
 * SECTION HEADER Component
 */
export const SectionHeader = ({ title, subtitle = null, style = null }) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  )
}

/**
 * EMPTY STATE Component
 */
export const EmptyState = ({ icon = 'inbox', message = 'No data', description = '' }) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name={icon} size={48} color={ARIA_COLORS.border} />
      <Text style={styles.emptyMessage}>{message}</Text>
      {description && <Text style={styles.emptyDescription}>{description}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  // BUTTON STYLES
  button: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // INPUT STYLES
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ARIA_COLORS.ink,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: ARIA_COLORS.creamDark,
    borderWidth: 1,
    height: 48,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: ARIA_COLORS.ink,
  },
  inputError: {
    fontSize: 12,
    color: ARIA_COLORS.rust,
    marginTop: 6,
  },

  // CARD STYLES
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderColor: ARIA_COLORS.border,
    borderWidth: 1,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // STAT CARD STYLES
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: ARIA_COLORS.stone,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  // BADGE STYLES
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // SECTION HEADER
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ARIA_COLORS.ink,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: ARIA_COLORS.stone,
    marginTop: 4,
  },

  // DIVIDER
  divider: {
    height: 1,
    backgroundColor: ARIA_COLORS.border,
    marginVertical: 12,
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: ARIA_COLORS.ink,
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 12,
    color: ARIA_COLORS.stone,
    marginTop: 6,
  },
})
