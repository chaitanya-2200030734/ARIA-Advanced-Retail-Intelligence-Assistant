import express from 'express'
import { sendMessage } from '../services/groq.js'
import Inventory from '../models/Inventory.js'
import Sales from '../models/Sales.js'
import Customer from '../models/Customer.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const [inventory, sales, customers] = await Promise.all([
      Inventory.find(),
      Sales.find(),
      Customer.find()
    ])

    const allData = { inventory, sales, customers }

    const insightPrompt = `You are a senior retail business intelligence analyst. Analyze the complete store data and return ONLY a valid JSON object with exactly these four keys:
  "executive_summary": string — 2 to 3 sentences summarizing the business health
  "risks": array of exactly 3 strings — each a specific risk identified from the data
  "opportunities": array of exactly 3 strings — each a growth opportunity from the data
  "actions": array of exactly 3 strings — each a specific actionable recommendation
  Return only valid JSON. No markdown. No preamble. No explanation.`

    const rawResponse = await sendMessage(
      insightPrompt,
      'Store data: ' + JSON.stringify(allData),
      []
    )

    try {
      const cleaned = rawResponse.replace(/```json\n?|\n?```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      res.json(parsed)
    } catch {
      res.json({ raw: rawResponse, parseError: true })
    }
  } catch (error) {
    next(error)
  }
})

export default router
