import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, FlatList, Alert } from 'react-native'
import { getSales, getTodaySales } from '../../services/api'
import { StatCard } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'

export default function SalesScreen() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    totalTransactions: 0,
  })
  const [recentSales, setRecentSales] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [todaySales, allSales] = await Promise.all([getTodaySales(), getSales()])

      if (todaySales && allSales) {
        const todayRevenue = todaySales.reduce((sum, s) => sum + parseFloat(s.sale_amount || 0), 0)

        const last7Days = {}
        const today = new Date()
        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateKey = date.toISOString().split('T')[0]
          last7Days[dateKey] = 0
        }

        allSales.forEach(sale => {
          const saleDate = new Date(sale.sale_date).toISOString().split('T')[0]
          if (last7Days.hasOwnProperty(saleDate)) {
            last7Days[saleDate] += parseFloat(sale.sale_amount || 0)
          }
        })

        const weekRevenue = Object.values(last7Days).reduce((a, b) => a + b, 0)

        setStats({
          todayRevenue: Math.round(todayRevenue),
          weekRevenue: Math.round(weekRevenue),
          totalTransactions: allSales.length,
        })
        setRecentSales(allSales.slice(0, 10))
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch sales data')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const renderSale = ({ item }) => (
    <View style={styles.saleItem}>
      <View>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.customerName}>{item.customer_name}</Text>
      </View>
      <View style={styles.saleRight}>
        <Text style={styles.amount}>₹{parseFloat(item.sale_amount).toLocaleString('en-IN')}</Text>
        <Text style={styles.saleDate}>
          {new Date(item.sale_date).toLocaleDateString('en-IN')}
        </Text>
      </View>
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <StatCard label="Today's Revenue" value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`} color="amber" />
          <StatCard label="This Week" value={`₹${stats.weekRevenue.toLocaleString('en-IN')}`} color="forest" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sales</Text>
          <Text style={styles.transactionCount}>{stats.totalTransactions} total</Text>
        </View>

        <FlatList
          data={recentSales}
          renderItem={renderSale}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
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
  statsSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1814',
  },
  transactionCount: {
    fontSize: 12,
    color: '#8A8278',
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
  },
  customerName: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 2,
  },
  saleRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C97B2E',
  },
  saleDate: {
    fontSize: 10,
    color: '#8A8278',
    marginTop: 2,
  },
})
