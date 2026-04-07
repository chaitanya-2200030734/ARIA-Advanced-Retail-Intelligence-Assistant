import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required')
      return
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required')
      return
    }

    if (!password) {
      Alert.alert('Error', 'Password is required')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const result = await signup(email, password, fullName)
    setLoading(false)

    if (result.error) {
      Alert.alert('Signup Failed', result.error)
    } else {
      Alert.alert('Success', 'Account created successfully!')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ARIA</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#8A8278"
            value={fullName}
            onChangeText={setFullName}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#8A8278"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor="#8A8278"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#8A8278"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.hint}>At least 8 characters</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="••••••••"
              placeholderTextColor="#8A8278"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#8A8278"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title={loading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSignup}
          disabled={loading}
          variant="primary"
          style={styles.button}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text style={styles.switchLink}>Sign in here</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to home</Text>
        </TouchableOpacity>
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
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#C97B2E',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#1C1814',
    marginTop: 8,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    backgroundColor: '#EDE9E0',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1C1814',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9E0',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  showButton: {
    padding: 8,
  },
  hint: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  button: {
    paddingVertical: 14,
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D8D2C8',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#8A8278',
    fontSize: 12,
  },
  switchText: {
    textAlign: 'center',
    color: '#8A8278',
    fontSize: 14,
  },
  switchLink: {
    color: '#C97B2E',
    fontWeight: '600',
  },
  backText: {
    textAlign: 'center',
    color: '#C97B2E',
    fontSize: 14,
    marginTop: 16,
  },
})
