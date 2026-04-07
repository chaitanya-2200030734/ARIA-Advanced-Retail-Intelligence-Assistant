import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native'
import { getInventory, getLowStock, getTodaySales, getSales, getCustomers } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { StatCard } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function DashboardScreen() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    totalCustomers: 0,
  })

  const fetchData = async () => {
    try {
      const [inventory, lowStock, todaySales, allSales, customers] = await Promise.all([
        getInventory(),
        getLowStock(),
        getTodaySales(),
        getSales(),
        getCustomers(),
      ])

      if (inventory && lowStock && todaySales && customers) {
        const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.sale_amount || 0), 0)

        setStats({
          totalProducts: inventory.length,
          lowStockCount: lowStock.length,
          todayRevenue: Math.round(todayRevenue),
          totalCustomers: customers.length,
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting} 👋</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={18} color="#B94E2D" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {stats.lowStockCount > 0 && (
        <View style={styles.alert}>
          <MaterialIcons name="warning" size={20} color="#B94E2D" />
          <Text style={styles.alertText}>
            ⚠️ {stats.lowStockCount} items running low on stock
          </Text>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            label="Total Products"
            value={stats.totalProducts}
            color="forest"
          />
          <StatCard
            label="Low Stock"
            value={stats.lowStockCount}
            color="rust"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
            color="amber"
          />
          <StatCard
            label="Total Customers"
            value={stats.totalCustomers}
            color="slate"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <MaterialIcons name="trending-up" size={24} color="#C97B2E" />
            <View>
              <Text style={styles.infoLabel}>Latest Update</Text>
              <Text style={styles.infoValue}>Real-time sync</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="check-circle" size={24} color="#2A4A35" />
            <View>
              <Text style={styles.infoLabel}>System Status</Text>
              <Text style={styles.infoValue}>All systems online</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>💡 Tip: Use the ARIA Chat tab to ask questions about your store data</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  date: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FBF4EB',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoutText: {
    color: '#B94E2D',
    fontSize: 14,
    fontWeight: '600',
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: '#FBF4EB',
    borderLeftColor: '#B94E2D',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertText: {
    marginLeft: 12,
    color: '#B94E2D',
    fontSize: 12,
    flex: 1,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1814',
    marginBottom: 12,
  },
  quickInfo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomColor: '#EDE9E0',
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8A8278',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
    marginLeft: 12,
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
    lineHeight: 18,
  },
})
