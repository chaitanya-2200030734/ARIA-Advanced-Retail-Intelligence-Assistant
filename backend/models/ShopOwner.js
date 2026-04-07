import mongoose from 'mongoose'

const ShopOwnerSchema = new mongoose.Schema(
  {
    shop_name: {
      type: String,
      required: true,
      trim: true,
    },
    owner_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    shop_address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    gst_number: {
      type: String,
      trim: true,
    },
    shop_category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Grocery', 'Home Appliances', 'Other'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approval_date: {
      type: Date,
      default: null,
    },
    approval_notes: {
      type: String,
      default: null,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    role: {
      type: String,
      default: 'shop_owner',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('ShopOwner', ShopOwnerSchema)
