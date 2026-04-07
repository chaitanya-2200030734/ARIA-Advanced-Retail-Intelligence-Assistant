import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native'
import { getAllShopProducts } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { MaterialIcons } from '@expo/vector-icons'

export default function UserDashboardScreen() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchProducts = async () => {
    try {
      console.log('[UserDashboard] Fetching products...')
      const data = await getAllShopProducts()
      if (data) {
        console.log('[UserDashboard] Fetched', data.length, 'products')
        setProducts(data)
      }
    } catch (error) {
      console.error('[UserDashboard] Fetch error:', error)
      Alert.alert('Error', 'Failed to fetch products')
    } finally {
      setRefreshing(false)
    }
  }

  // Auto-refresh products every 5 seconds
  useEffect(() => {
    fetchProducts()
    const interval = setInterval(() => {
      console.log('[UserDashboard] Auto-refreshing...')
      fetchProducts()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts()
  }

  const totalProducts = products.length
  const inStockCount = products.filter(p => p.stock_quantity > 0).length
  const userName = user?.email?.split('@')[0] || 'Customer'

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.welcome}>
        <Text style={styles.greeting}>Welcome, {userName}! 👋</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.stat, { backgroundColor: '#EBF3EE' }]}>
          <MaterialIcons name="shopping-bag" size={24} color="#2A4A35" />
          <Text style={styles.statValue}>{inStockCount}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
        </View>

        <View style={[styles.stat, { backgroundColor: '#FDBF8F' }]}>
          <MaterialIcons name="trending-up" size={24} color="#C97B2E" />
          <Text style={styles.statValue}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>

        <View style={[styles.stat, { backgroundColor: '#C8DAD0' }]}>
          <MaterialIcons name="local-shipping" size={24} color="#2A4A35" />
          <Text style={styles.statValue}>Free</Text>
          <Text style={styles.statLabel}>Shipping</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shopping Guide</Text>
        <View style={styles.guide}>
          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Browse Products</Text>
              <Text style={styles.stepDesc}>Go to Shop tab to explore</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Add to Cart</Text>
              <Text style={styles.stepDesc}>Select quantity and add items</Text>
            </View>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View>
              <Text style={styles.stepTitle}>Checkout</Text>
              <Text style={styles.stepDesc}>Review & place your order</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tip}>
        <MaterialIcons name="info" size={18} color="#C97B2E" />
        <Text style={styles.tipText}>Use ARIA Chat to ask about products or get recommendations</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  welcome: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  date: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8,
  },
  stat: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1814',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#8A8278',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1814',
    marginBottom: 12,
  },
  guide: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  guideStep: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'flex-start',
    borderBottomColor: '#EDE9E0',
    borderBottomWidth: 1,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C97B2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
  },
  stepDesc: {
    fontSize: 11,
    color: '#8A8278',
    marginTop: 2,
  },
  tip: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FBF4EB',
    borderLeftColor: '#C97B2E',
    borderLeftWidth: 3,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  tipText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#8A8278',
    flex: 1,
  },
})
