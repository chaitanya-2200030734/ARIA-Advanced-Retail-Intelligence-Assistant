import express from 'express'
import Sales from '../models/Sales.js'
import { sendMessage } from '../services/groq.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const data = await Sales.find().sort({ sale_date: -1 }).limit(50)
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/today', async (req, res, next) => {
  try {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const data = await Sales.find({
      sale_date: { $gte: start, $lte: end }
    })
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/forecast', async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSales = await Sales.find({
      sale_date: { $gte: thirtyDaysAgo }
    })

    const forecastPrompt = 'You are a retail sales forecaster. Analyze the last 30 days of sales data and write a 3-4 sentence forecast for next week. Include expected revenue range, products likely to perform well, and one actionable recommendation. Be specific with numbers.'
    const forecast = await sendMessage(
      forecastPrompt,
      'Sales data: ' + JSON.stringify(recentSales),
      []
    )
    res.json({ forecast })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newSale = await Sales.create(req.body)
    res.status(201).json(newSale)
  } catch (error) {
    next(error)
  }
})

export default router
