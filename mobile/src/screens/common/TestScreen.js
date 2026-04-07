import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'

export default function TestScreen({ navigation }) {
  const handleTest = async () => {
    try {
      // Test API connectivity
      const response = await fetch('http://YOUR_IP_HERE:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'wrong' }),
      })
      const data = await response.json()
      Alert.alert('API Response', JSON.stringify(data))
    } catch (error) {
      Alert.alert('API Error', error.message)
    }
  }

  React.useEffect(() => {
    console.log('TestScreen mounted successfully')
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ARIA Retail - Test Screen</Text>
        <Text style={styles.subtitle}>If you see this, React is working!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleTest}
        >
          <Text style={styles.buttonText}>Test API Connection</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Setup Instructions:</Text>
          <Text style={styles.infoText}>1. Update YOUR_IP_HERE in TestScreen.js with your local IP</Text>
          <Text style={styles.infoText}>2. Make sure backend is running on port 5000</Text>
          <Text style={styles.infoText}>3. Press "Test API Connection" button</Text>
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
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1814',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8278',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#C97B2E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#F5F2ED',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    backgroundColor: '#EDE9E0',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#C97B2E',
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#1C1814',
    marginBottom: 10,
  },
  infoText: {
    color: '#8A8278',
    marginBottom: 5,
    fontSize: 13,
  },
})
