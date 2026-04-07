import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, TextInput, TouchableOpacity, Alert } from 'react-native'
import { getInventory } from '../../services/api'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function InventoryScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchItems = async () => {
    try {
      const data = await getInventory()
      if (data) setItems(data)
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch inventory')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchItems()
  }

  const filteredItems = items.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderItem = ({ item }) => {
    const isLowStock = item.stock_quantity <= item.reorder_level
    return (
      <View style={[styles.itemCard, isLowStock && styles.lowStockCard]}>
        <View style={styles.itemHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{item.product_name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          {isLowStock && (
            <View style={styles.badge}>
              <MaterialIcons name="warning" size={16} color="#B94E2D" />
              <Text style={styles.badgeText}>Low</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Stock</Text>
            <Text style={[styles.detailValue, isLowStock && { color: '#B94E2D' }]}>
              {item.stock_quantity} units
            </Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>₹{item.unit_price.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Reorder</Text>
            <Text style={styles.detailValue}>{item.reorder_level}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#8A8278" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#8A8278"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="inventory-2" size={40} color="#D8D2C8" />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        scrollEnabled={false}
        style={styles.list}
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
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  lowStockCard: {
    borderLeftColor: '#B94E2D',
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
  },
  category: {
    fontSize: 12,
    color: '#8A8278',
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: '#FDF0ED',
    borderColor: '#B94E2D',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#B94E2D',
    fontWeight: '600',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#8A8278',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
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
