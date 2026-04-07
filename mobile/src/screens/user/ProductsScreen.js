import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { getAllShopProducts } from '../../services/api'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ProductsScreen() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      console.log('[ProductsScreen] Fetching products...')
      const data = await getAllShopProducts(selectedCategory !== 'All' ? selectedCategory : null, searchTerm || null)
      if (data) {
        console.log('[ProductsScreen] Fetched', data.length, 'products')
        setProducts(data)
        const cats = ['All', ...new Set(data.map(p => p.category))]
        setCategories(cats)
      }
    } catch (error) {
      console.error('[ProductsScreen] Fetch error:', error)
      Alert.alert('Error', 'Failed to fetch products')
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchProducts()
  }, [])

  // Auto-refresh products every 5 seconds (so users see newly added products)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[ProductsScreen] Auto-refreshing products...')
      fetchProducts()
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedCategory, searchTerm])

  useEffect(() => {
    let filtered = products
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  const handleAddToCart = async (product) => {
    try {
      const cart = JSON.parse(await AsyncStorage.getItem('cart') || '[]')
      const existingItem = cart.find(item => item._id === product._id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({ ...product, quantity: 1 })
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart))
      Alert.alert('Success', 'Added to cart!')
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart')
    }
  }

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleAddToCart(item)}
      disabled={item.stock_quantity === 0}
    >
      <View style={styles.productImage}>
        <MaterialIcons name="shopping-bag" size={40} color="#C97B2E" />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.category}>{item.category}</Text>

        <View style={styles.productFooter}>
          <Text style={styles.price}>₹{item.unit_price.toLocaleString('en-IN')}</Text>
          <View style={styles.stockBadge}>
            <Text style={[
              styles.stockText,
              { color: item.stock_quantity > 0 ? '#2A4A35' : '#B94E2D' }
            ]}>
              {item.stock_quantity > 0 ? `${item.stock_quantity} left` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>

      {item.stock_quantity > 0 && (
        <TouchableOpacity onPress={() => handleAddToCart(item)}>
          <MaterialIcons name="add-circle" size={28} color="#C97B2E" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )

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
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === item && styles.categoryTextActive
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true)
          fetchProducts()
        }} />}
        scrollEnabled={true}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="shopping-bag" size={40} color="#D8D2C8" />
            <Text style={styles.emptyText}>No products found</Text>
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
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#1C1814',
    fontSize: 14,
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#C97B2E',
    borderColor: '#C97B2E',
  },
  categoryText: {
    fontSize: 12,
    color: '#8A8278',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#EDE9E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
  },
  category: {
    fontSize: 11,
    color: '#8A8278',
    marginTop: 2,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C97B2E',
  },
  stockBadge: {
    backgroundColor: '#EDE9E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '500',
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
