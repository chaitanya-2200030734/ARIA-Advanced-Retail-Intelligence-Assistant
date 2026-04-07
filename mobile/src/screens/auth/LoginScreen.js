import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function LoginScreen({ navigation }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required')
      return
    }

    if (!password) {
      Alert.alert('Error', 'Password is required')
      return
    }

    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.error) {
      Alert.alert('Login Failed', result.error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>ARIA</Text>
        <Text style={styles.subtitle}>Sign in to your dashboard</Text>
      </View>

      <View style={styles.form}>
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
        </View>

        <Button
          title={loading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          disabled={loading}
          variant="primary"
          style={styles.button}
        />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.switchText}>
            Don't have an account?{' '}
            <Text style={styles.switchLink}>Sign up here</Text>
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
    marginBottom: 20,
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
