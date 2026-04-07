import express from 'express'
import Customer from '../models/Customer.js'
import Sales from '../models/Sales.js'
import { sendMessage } from '../services/groq.js'
import mongoose from 'mongoose'

const router = express.Router()

// Guard: reject requests where :id is missing or not a valid ObjectId
const validateId = (req, res, next) => {
  const { id } = req.params
  if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid customer ID' })
  }
  next()
}

router.get('/', async (req, res, next) => {
  try {
    const data = await Customer.find().sort({ total_purchases: -1 })
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const history = await Sales.find({ customer_name: customer.name })
      .sort({ sale_date: -1 })
      .limit(20)

    res.json({ customer, purchaseHistory: history })
  } catch (error) {
    next(error)
  }
})

router.get('/:id/recommendations', validateId, async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }

    const purchaseHistory = await Sales.find({ customer_name: customer.name }).limit(20)

    const recoPrompt = 'You are a retail product recommendation engine. Based on a customer purchase history, recommend exactly 4 products they are likely to buy next. For each recommendation give the product name and one sentence reason. Format as a simple numbered list.'
    const recommendations = await sendMessage(
      recoPrompt,
      'Customer: ' + customer.name + '\nPurchase history: ' + JSON.stringify(purchaseHistory),
      []
    )
    res.json({ recommendations })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const newCustomer = await Customer.create(req.body)
    res.status(201).json(newCustomer)
  } catch (error) {
    next(error)
  }
})

export default router
