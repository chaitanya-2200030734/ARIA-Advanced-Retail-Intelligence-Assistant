import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

export default function InsightsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Business Intelligence</Text>
        <Text style={styles.subtitle}>AI-powered insights about your store</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="trending-up" size={24} color="#C97B2E" />
          <Text style={styles.cardTitle}>Key Metrics</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Revenue Trend</Text>
          <Text style={styles.metricValue}>Upward ↑</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Top Category</Text>
          <Text style={styles.metricValue}>Electronics</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Avg Order Value</Text>
          <Text style={styles.metricValue}>₹2,450</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="warning" size={24} color="#B94E2D" />
          <Text style={styles.cardTitle}>Identified Risks</Text>
        </View>
        <Text style={styles.riskText}>• Low stock on 3 popular items</Text>
        <Text style={styles.riskText}>• Sales declining in one category</Text>
        <Text style={styles.riskText}>• High cart abandonment rate</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="lightbulb" size={24} color="#2A4A35" />
          <Text style={styles.cardTitle}>Opportunities</Text>
        </View>
        <Text style={styles.oppText}>• Bundle top sellers for discounts</Text>
        <Text style={styles.oppText}>• Launch email campaign to inactive users</Text>
        <Text style={styles.oppText}>• Increase inventory for high-demand items</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Updated daily using AI analysis</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  subtitle: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1814',
    marginLeft: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#EDE9E0',
    borderBottomWidth: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#8A8278',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1814',
  },
  riskText: {
    fontSize: 12,
    color: '#1C1814',
    marginVertical: 6,
    lineHeight: 18,
  },
  oppText: {
    fontSize: 12,
    color: '#1C1814',
    marginVertical: 6,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#EDE9E0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#1C1814',
  },
})
