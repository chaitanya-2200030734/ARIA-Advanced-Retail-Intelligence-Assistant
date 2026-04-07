import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export default function ShopOwnerSignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    shop_name: '',
    owner_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    address: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignup = async () => {
    // Validation
    if (!formData.shop_name.trim()) {
      Alert.alert('Error', 'Shop name is required')
      return
    }
    if (!formData.owner_name.trim()) {
      Alert.alert('Error', 'Owner name is required')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Valid email is required')
      return
    }
    if (!formData.password) {
      Alert.alert('Error', 'Password is required')
      return
    }
    if (formData.password !== formData.confirm_password) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://192.168.100.119:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.owner_name,
          role: 'shop_owner',
          shop_name: formData.shop_name,
          phone: formData.phone || '',
          address: formData.address || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert('Signup Failed', data.error || 'Something went wrong')
      } else {
        Alert.alert('Success', 'Shop owner account created! Please login.')
        navigation.navigate('Login')
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#1C1814" />
        </TouchableOpacity>
        <Text style={styles.title}>Register Shop</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter shop name"
            placeholderTextColor="#8A8278"
            value={formData.shop_name}
            onChangeText={(text) => handleChange('shop_name', text)}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Owner Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#8A8278"
            value={formData.owner_name}
            onChangeText={(text) => handleChange('owner_name', text)}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="shop@example.com"
            placeholderTextColor="#8A8278"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="+91-9XXXXXXXXX"
            placeholderTextColor="#8A8278"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Shop address"
            placeholderTextColor="#8A8278"
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password *</Text>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              placeholderTextColor="#8A8278"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#8A8278" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#8A8278"
            secureTextEntry={!showPassword}
            value={formData.confirm_password}
            onChangeText={(text) => handleChange('confirm_password', text)}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1814',
    borderWidth: 1,
    borderColor: '#D8D2C8',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D8D2C8',
  },
  button: {
    backgroundColor: '#C97B2E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#F5F2ED',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#8A8278',
    fontSize: 14,
  },
  link: {
    color: '#C97B2E',
    fontWeight: '600',
    fontSize: 14,
  },
})
