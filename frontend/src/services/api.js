import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
})

const safe = async (fn) => {
  try {
    return await fn()
  } catch (e) {
    console.error(e)
    return null
  }
}

export const sendChatMessage = (message, history, role = 'user') =>
  safe(() => api.post('/api/chat', { message, history, role }).then(r => r.data))

export const getInventory = () =>
  safe(() => api.get('/api/inventory').then(r => r.data))

export const getLowStock = () =>
  safe(() => api.get('/api/inventory/low-stock').then(r => r.data))

export const createInventory = (d) =>
  safe(() => api.post('/api/inventory', d).then(r => r.data))

export const updateInventory = (id, d) =>
  safe(() => api.put(`/api/inventory/${id}`, d).then(r => r.data))

export const deleteInventory = (id) =>
  safe(() => api.delete(`/api/inventory/${id}`).then(() => true))

export const getSales = () =>
  safe(() => api.get('/api/sales').then(r => r.data))

export const getTodaySales = () =>
  safe(() => api.get('/api/sales/today').then(r => r.data))

export const getSalesForecast = () =>
  safe(() => api.get('/api/sales/forecast').then(r => r.data.forecast))

export const createSale = (d) =>
  safe(() => api.post('/api/sales', d).then(r => r.data))

export const getCustomers = () =>
  safe(() => api.get('/api/customers').then(r => r.data))

export const getCustomerById = (id) =>
  safe(() => api.get(`/api/customers/${id}`).then(r => r.data))

export const getCustomerReco = (id) =>
  safe(() => api.get(`/api/customers/${id}/recommendations`).then(r => r.data.recommendations))

export const createCustomer = (d) =>
  safe(() => api.post('/api/customers', d).then(r => r.data))

export const getInsights = () =>
  safe(() => api.get('/api/insights').then(r => r.data))
