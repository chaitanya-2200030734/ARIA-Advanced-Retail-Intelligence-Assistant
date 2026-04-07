import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEnvVars from '../config/constants'

const API_BASE_URL = getEnvVars.apiUrl

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
})

// Add token to requests
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

const safe = async fn => {
  try {
    return await fn()
  } catch (e) {
    console.error('API Error:', e)
    return null
  }
}

// Auth endpoints
export const getAuth = () =>
  safe(() => api.get('/auth/me').then(r => r.data))

// Inventory endpoints
export const getInventory = () =>
  safe(() => api.get('/inventory').then(r => r.data))

export const getLowStock = () =>
  safe(() => api.get('/inventory/low-stock').then(r => r.data))

export const createInventory = d =>
  safe(() => api.post('/inventory', d).then(r => r.data))

export const updateInventory = (id, d) =>
  safe(() => api.put(`/inventory/${id}`, d).then(r => r.data))

export const deleteInventory = id =>
  safe(() => api.delete(`/inventory/${id}`).then(() => true))

// Sales endpoints
export const getSales = () =>
  safe(() => api.get('/sales').then(r => r.data))

export const getTodaySales = () =>
  safe(() => api.get('/sales/today').then(r => r.data))

export const getSalesForecast = () =>
  safe(() => api.get('/sales/forecast').then(r => r.data.forecast))

export const createSale = d =>
  safe(() => api.post('/sales', d).then(r => r.data))

// Customers endpoints
export const getCustomers = () =>
  safe(() => api.get('/customers').then(r => r.data))

export const getCustomerById = id =>
  safe(() => api.get(`/customers/${id}`).then(r => r.data))

export const getCustomerReco = id =>
  safe(() => api.get(`/customers/${id}/recommendations`).then(r => r.data.recommendations))

export const createCustomer = d =>
  safe(() => api.post('/customers', d).then(r => r.data))

// Chat endpoint
export const sendChatMessage = (message, history, role = 'user') =>
  safe(() => api.post('/chat', { message, history, role }).then(r => r.data))

// Insights endpoint
export const getInsights = () =>
  safe(() => api.get('/insights').then(r => r.data))

// Shop Products endpoints (for users to browse and purchase)
export const getAllShopProducts = (category = null, search = null) => {
  let url = '/shop-products'
  const params = new URLSearchParams()
  
  if (category && category !== 'All') {
    params.append('category', category)
  }
  if (search) {
    params.append('search', search)
  }
  
  if (params.toString()) {
    url += '?' + params.toString()
  }
  
  console.log('[getAllShopProducts] Calling:', url)
  return safe(async () => {
    const result = await api.get(url)
    console.log('[getAllShopProducts] Response:', result.data.length, 'products')
    return result.data
  })
}

export const getShopProductsByShop = (shopId) =>
  safe(() => api.get(`/shop-products/shop/${shopId}`).then(r => r.data))

export const getShopProductDetail = (productId) =>
  safe(() => api.get(`/shop-products/${productId}`).then(r => r.data))

export default api
