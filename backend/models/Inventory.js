import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock_quantity: {
    type: Number,
    default: 0,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  reorder_level: {
    type: Number,
    default: 10,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Inventory', inventorySchema)
