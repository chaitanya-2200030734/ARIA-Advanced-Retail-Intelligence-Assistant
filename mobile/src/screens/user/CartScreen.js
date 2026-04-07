import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { createSale } from '../../services/api'
import { Button } from '../../components/UI'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function CartScreen() {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = JSON.parse(await AsyncStorage.getItem('cart') || '[]')
        setCart(savedCart)
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }

    const unsubscribe = setInterval(loadCart, 1000)
    loadCart()
    return () => clearInterval(unsubscribe)
  }, [])

  const updateQuantity = async (productId, quantity) => {
    const updated = cart.map(item =>
      item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
    setCart(updated)
    await AsyncStorage.setItem('cart', JSON.stringify(updated))
  }

  const removeItem = async (productId) => {
    const updated = cart.filter(item => item._id !== productId)
    setCart(updated)
    await AsyncStorage.setItem('cart', JSON.stringify(updated))
    Alert.alert('Removed', 'Item removed from cart')
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add items before checking out')
      return
    }

    try {
      for (const item of cart) {
        await createSale({
          product_name: item.product_name,
          category: item.category,
          quantity_sold: item.quantity,
          sale_amount: item.unit_price * item.quantity,
          sale_date: new Date().toISOString(),
          customer_name: user?.email?.split('@')[0] || 'Customer',
        })
      }

      Alert.alert('Success', `Order placed! Total: ₹${cartTotal.toLocaleString('en-IN')}`)
      setCart([])
      await AsyncStorage.removeItem('cart')
    } catch (error) {
      Alert.alert('Error', 'Failed to place order')
    }
  }

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        <MaterialIcons name="shopping-bag" size={32} color="#C97B2E" />
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product_name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>₹{item.unit_price.toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity - 1)}>
          <MaterialIcons name="remove-circle" size={24} color="#C97B2E" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item._id, item.quantity + 1)}>
          <MaterialIcons name="add-circle" size={24} color="#C97B2E" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => removeItem(item._id)}>
        <MaterialIcons name="close" size={24} color="#B94E2D" />
      </TouchableOpacity>
    </View>
  )

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-cart" size={64} color="#D8D2C8" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Start shopping to add items</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        scrollEnabled={true}
        style={styles.list}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items</Text>
          <Text style={styles.summaryValue}>{itemCount}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString('en-IN')}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{cartTotal.toLocaleString('en-IN')}</Text>
        </View>

        <Button
          title={`Checkout (₹${cartTotal.toLocaleString('en-IN')})`}
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />

        <Text style={styles.disclaimer}>Free shipping on all orders</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2ED',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F2ED',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1814',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A8278',
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderColor: '#D8D2C8',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#EDE9E0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
  },
  itemCategory: {
    fontSize: 11,
    color: '#8A8278',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C97B2E',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1814',
    minWidth: 20,
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D8D2C8',
    borderTopWidth: 1,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8A8278',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1814',
  },
  totalRow: {
    paddingTopMargin: 12,
    borderTopColor: '#D8D2C8',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1814',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C97B2E',
  },
  checkoutButton: {
    paddingVertical: 14,
    marginTop: 16,
  },
  disclaimer: {
    fontSize: 11,
    color: '#8A8278',
    textAlign: 'center',
    marginTop: 8,
  },
})
