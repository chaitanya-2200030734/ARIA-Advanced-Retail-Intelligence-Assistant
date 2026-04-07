import express from 'express'
import Inventory from '../models/Inventory.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const data = await Inventory.find()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

router.get('/low-stock', async (req, res, next) => {
  try {
    const lowStock = await Inventory.find({
      $expr: { $lte: ['$stock_quantity', '$reorder_level'] }
    })
    res.json(lowStock)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.product_name) {
      return res.status(400).json({ error: 'product_name is required' })
    }
    const newItem = await Inventory.create(req.body)
    res.status(201).json(newItem)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updated) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Inventory.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
