import mongoose from 'mongoose'

const ShopProductSchema = new mongoose.Schema(
  {
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopOwner',
      required: true,
    },
    shop_name: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Grocery', 'Home Appliances', 'Other'],
    },
    description: {
      type: String,
      trim: true,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock_quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('ShopProduct', ShopProductSchema)
