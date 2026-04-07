import supabase from './supabaseClient.js'

export async function getInventory() {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('product_name')
  if (error) throw error
  return data
}

export async function getSales() {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('sale_date', { ascending: false })
    .limit(50)
  if (error) throw error
  return data
}

export async function getLast30DaysSales() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .gte('sale_date', since)
    .order('sale_date', { ascending: true })
  if (error) throw error
  return data
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('total_purchases', { ascending: false })
  if (error) throw error
  return data
}

export async function getLowStockItems() {
  const all = await getInventory()
  return all.filter(item => item.stock_quantity <= item.reorder_level)
}

export async function getTopSellingProducts() {
  const sales = await getSales()
  
  const grouped = {}
  sales.forEach(sale => {
    if (!grouped[sale.product_name]) {
      grouped[sale.product_name] = { total_sold: 0, total_revenue: 0 }
    }
    grouped[sale.product_name].total_sold += sale.quantity_sold || 0
    grouped[sale.product_name].total_revenue += parseFloat(sale.sale_amount || 0)
  })

  return Object.entries(grouped)
    .map(([product_name, data]) => ({ product_name, ...data }))
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5)
}

export async function getSalesByDay(days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('sales')
    .select('*')
    .gte('sale_date', since)
    .order('sale_date', { ascending: true })

  const grouped = {}
  data.forEach(sale => {
    const date = new Date(sale.sale_date).toISOString().split('T')[0]
    if (!grouped[date]) grouped[date] = 0
    grouped[date] += parseFloat(sale.sale_amount || 0)
  })

  return Object.entries(grouped).map(([date, total]) => ({ date, total }))
}
