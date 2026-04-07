import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TextInput } from 'react-native'
import { getCustomers } from '../../services/api'
import { MaterialIcons } from '@expo/vector-icons'

export default function CustomersScreen() {
  const [customers, setCustomers] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers()
      if (data) setCustomers(data)
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchCustomers()
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderCustomer = ({ item }) => (
    <View style={styles.customerCard}>
      <View style={styles.cardContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name[0]}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.meta}>
            <MaterialIcons name="phone" size={12} color="#8A8278" />
            <Text style={styles.phone}>{item.phone || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Text style={styles.purchaseValue}>
            ₹{item.total_purchases.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.purchaseLabel}>Total Spend</Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#8A8278" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search customers..."
          placeholderTextColor="#8A8278"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="people" size={40} color="#D8D2C8" />
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#1C1814',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
  },
  customerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C97B2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
  },
  email: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phone: {
    fontSize: 11,
    color: '#8A8278',
    marginLeft: 4,
  },
  stats: {
    alignItems: 'flex-end',
  },
  purchaseValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C97B2E',
  },
  purchaseLabel: {
    fontSize: 10,
    color: '#8A8278',
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8278',
    marginTop: 8,
  },
})
