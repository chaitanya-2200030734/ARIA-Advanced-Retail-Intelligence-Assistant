import mongoose from 'mongoose'

const salesSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity_sold: {
    type: Number,
    required: true,
  },
  sale_amount: {
    type: Number,
    required: true,
  },
  sale_date: {
    type: Date,
    default: Date.now,
  },
  customer_name: {
    type: String,
    required: true,
  },
})

export default mongoose.model('Sales', salesSchema)
