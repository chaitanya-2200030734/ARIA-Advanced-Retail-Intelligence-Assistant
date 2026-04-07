import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [appReady, setAppReady] = React.useState(false)

  React.useEffect(() => {
    async function prepare() {
      try {
        console.log('App initializing...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        await SplashScreen.hideAsync()
        setAppReady(true)
        console.log('App ready!')
      } catch (error) {
        console.error('Initialization error:', error)
      }
    }

    prepare()
  }, [])

  if (!appReady) {
    return null
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>ARIA</Text>
          <Text style={styles.subtitle}>Your Store. Understood.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>✅ App is Working!</Text>
          <Text style={styles.cardText}>
            If you see this screen, the basic React Native setup is functional.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Steps:</Text>
          <Text style={styles.cardText}>1. Update BACKEND_IP in src/config/constants.js</Text>
          <Text style={styles.cardText}>2. Replace with your computer's local IP address</Text>
          <Text style={styles.cardText}>3. Make sure backend is running on port 5000</Text>
          <Text style={styles.cardText}>4. Reload the app (press 'r' in the terminal)</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ready to Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#C97B2E',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#8A8278',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C97B2E',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1814',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#8A8278',
    lineHeight: 20,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#C97B2E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#F5F2ED',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
