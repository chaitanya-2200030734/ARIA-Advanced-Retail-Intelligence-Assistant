import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  total_purchases: {
    type: Number,
    default: 0,
  },
  joined_at: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('Customer', customerSchema)
