import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

export default function ErrorBoundaryScreen() {
  const [errorLog, setErrorLog] = React.useState([
    'App started',
    'Loading modules...',
  ])

  React.useEffect(() => {
    console.log = (message) => {
      setErrorLog(prev => [...prev, `[LOG] ${message}`])
    }
    console.error = (message) => {
      setErrorLog(prev => [...prev, `[ERROR] ${message}`])
    }
    console.warn = (message) => {
      setErrorLog(prev => [...prev, `[WARN] ${message}`])
    }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Console</Text>
      </View>
      <ScrollView style={styles.logContainer}>
        {errorLog.map((log, idx) => (
          <Text key={idx} style={[
            styles.logText,
            log.includes('ERROR') && styles.errorText,
            log.includes('WARN') && styles.warnText,
          ]}>
            {log}
          </Text>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.clearButton}
        onPress={() => setErrorLog(['Cleared'])}
      >
        <Text style={styles.clearText}>Clear</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1814',
  },
  header: {
    backgroundColor: '#C97B2E',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F2ED',
  },
  logContainer: {
    flex: 1,
    padding: 10,
  },
  logText: {
    color: '#F5F2ED',
    fontSize: 11,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#B94E2D',
    fontWeight: 'bold',
  },
  warnText: {
    color: '#C97B2E',
  },
  clearButton: {
    backgroundColor: '#B94E2D',
    padding: 12,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    color: '#F5F2ED',
    fontWeight: 'bold',
  },
})
