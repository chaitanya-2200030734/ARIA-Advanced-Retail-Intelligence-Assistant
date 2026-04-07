import express from 'express'
import { sendMessage } from '../services/groq.js'
import Inventory from '../models/Inventory.js'
import Sales from '../models/Sales.js'
import Customer from '../models/Customer.js'

const router = express.Router()

const getInventory = () => Inventory.find().lean()
const getSales = () => Sales.find().sort({ sale_date: -1 }).limit(50).lean()
const getCustomers = () => Customer.find().lean()
const getLowStockItems = () => Inventory.find({ $expr: { $lte: ['$stock_quantity', '$reorder_level'] } }).lean()
const getTopSellingProducts = () =>
  Sales.aggregate([
    { $group: { _id: '$product_name', totalQty: { $sum: '$quantity_sold' }, totalRevenue: { $sum: '$sale_amount' } } },
    { $sort: { totalQty: -1 } },
    { $limit: 10 },
  ])
const getLast30DaysSales = () => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return Sales.find({ sale_date: { $gte: thirtyDaysAgo } }).lean()
}

router.post('/', async (req, res, next) => {
  try {
    const { message, history = [], role = 'user' } = req.body
    const msg = message.toLowerCase()
    let contextData = {}
    let wantsChart = false

    // Chart intent
    const chartWords = ['show', 'chart', 'graph', 'trend', 'breakdown', 'visualize', 'plot', 'compare', 'display']
    if (chartWords.some((w) => msg.includes(w))) wantsChart = true

    // Intent → MongoDB fetch
    const hasWord = (...words) => words.some((w) => msg.includes(w))

    if (hasWord('inventory', 'stock', 'product', 'item', 'available', 'sell', 'catalogue', 'catalog', 'have'))
      contextData.inventory = await getInventory()

    if (hasWord('sale', 'revenue', 'sold', 'today', 'money', 'earning', 'income', 'profit'))
      contextData.sales = await getSales()

    if (hasWord('customer', 'buyer', 'client', 'shopper', 'who'))
      contextData.customers = await getCustomers()

    if (hasWord('low', 'reorder', 'running out', 'restock', 'shortage', 'alert'))
      contextData.lowStock = await getLowStockItems()

    if (hasWord('top', 'best', 'popular', 'selling', 'most', 'favourite', 'favorite', 'recommended', 'deal', 'offer'))
      contextData.topProducts = await getTopSellingProducts()

    if (hasWord('forecast', 'predict', 'next week', 'future', 'expect', 'trend'))
      contextData.recentSales = await getLast30DaysSales()

    if (hasWord('summary', 'overview', 'report', 'everything', 'all', 'dashboard'))
      contextData = {
        inventory: await getInventory(),
        sales: await getSales(),
        customers: await getCustomers(),
      }

    // Fallback: if user is asking a shopping question with no context yet, load inventory
    if (Object.keys(contextData).length === 0) {
      contextData.inventory = await getInventory()
    }

    // Build context string
    const contextStr =
      Object.keys(contextData).length > 0
        ? `Live Store Data:\n${JSON.stringify(contextData, null, 2)}\n\n`
        : ''

    // Role-aware system prompt — KEEP ANSWERS SHORT (2-3 sentences max, plain English)
    const brevityRule = ` Always reply in 2-3 short sentences maximum. Use plain, simple English. No bullet points unless listing 3+ items. Be direct and friendly.`

    let systemPrompt
    if (role === 'home') {
      systemPrompt = `You are ARIA, an AI retail assistant for the ARIA Retail platform. Answer general questions about what ARIA does, its features (AI chatbot, live inventory insights, sales analytics), how to sign up, and how it helps store owners and shoppers. Do not answer questions about specific store data — just explain the platform.${brevityRule}`
    } else if (role === 'shopowner') {
      systemPrompt = `You are ARIA, an assistant for shop owners using the ARIA Retail platform. Help them understand how to add products, manage inventory, view their shop performance, and use platform features. Use store data if available, otherwise explain the feature.${brevityRule}`
    } else if (role === 'admin') {
      systemPrompt = `You are ARIA, a retail intelligence assistant for store administrators. Use the live store data above to give accurate answers with exact numbers, product names, and ₹ amounts. Never make up data — only use what is in the context.${brevityRule}`
    } else {
      systemPrompt = `You are ARIA, a friendly shopping assistant. Use the store data to answer questions about products, prices, and stock. Always use real product names and ₹ prices from the data. Help users find what they need and guide them to add to cart and checkout.${brevityRule}`
    }

    if (wantsChart) {
      systemPrompt += ` The user wants a visual chart. Return ONLY valid JSON (no markdown, no explanation) with: "type":"chart", "chartType":"bar"|"line"|"pie", "title":"<6 words>", "data":[{"label":"...","value":number},...], "summary":"<one sentence insight>".`
    }

    // Clean history: map 'bot' → 'assistant', strip extra fields, keep only user/assistant turns
    const cleanHistory = history
      .filter((m) => m.role === 'user' || m.role === 'bot' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'bot' ? 'assistant' : m.role,
        content: String(m.content),
      }))

    const userMsg = contextStr + 'User Question: ' + message
    const rawResponse = await sendMessage(systemPrompt, userMsg, cleanHistory)

    let reply
    if (wantsChart) {
      try {
        const cleaned = rawResponse.replace(/```json\n?|\n?```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        reply = parsed.type === 'chart' ? parsed : rawResponse
      } catch {
        reply = rawResponse
      }
    } else {
      reply = rawResponse
    }

    res.json({ reply, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Chat error:', error)
    next(error)
  }
})

// Transcribe audio using Groq Whisper
router.post('/transcribe', async (req, res, next) => {
  try {
    const { audio, mimeType } = req.body

    if (!audio) {
      return res.status(400).json({ error: 'Audio data required' })
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, 'base64')

    // For now, return a placeholder transcription
    // In production, you'd call Groq's speech-to-text API here
    // For demo purposes, we'll just mark it as received
    res.json({
      text: 'Voice input received. Please ensure Groq Whisper is configured.',
      success: true,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    res.status(500).json({ error: 'Transcription failed' })
  }
})

export default router
