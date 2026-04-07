import express from 'express'
import ShopOwner from '../models/ShopOwner.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Shop Owner Registration
router.post('/register', async (req, res) => {
  try {
    const {
      shop_name,
      owner_name,
      email,
      password,
      phone,
      shop_address,
      city,
      state,
      pincode,
      gst_number,
      shop_category,
    } = req.body

    // Validate required fields
    if (!shop_name || !owner_name || !email || !password || !phone || !shop_address || !city || !state || !pincode || !shop_category) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Check if shop owner already exists
    const existingShopOwner = await ShopOwner.findOne({ email })
    if (existingShopOwner) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new shop owner (status: pending by default)
    const newShopOwner = await ShopOwner.create({
      shop_name,
      owner_name,
      email,
      password: hashedPassword,
      phone,
      shop_address,
      city,
      state,
      pincode,
      gst_number: gst_number || null,
      shop_category,
      status: 'pending',
    })

    res.status(201).json({
      message: 'Registration submitted successfully. Please wait for admin approval.',
      shop_owner: newShopOwner,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Shop Owner Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const shopOwner = await ShopOwner.findOne({ email })
    if (!shopOwner) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check if approved
    if (shopOwner.status !== 'approved') {
      return res.status(403).json({ error: `Your account is ${shopOwner.status}. Please wait for admin approval.` })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, shopOwner.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: shopOwner._id,
        email: shopOwner.email,
        role: 'shop_owner',
        shop_id: shopOwner._id,
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production_123456789',
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Login successful',
      authToken: token,
      userRole: 'shop_owner',
      userEmail: shopOwner.email,
      shop_id: shopOwner._id,
      shop_name: shopOwner.shop_name,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Get all pending shop owners (for admin)
router.get('/pending', async (req, res) => {
  try {
    const pendingShopOwners = await ShopOwner.find({ status: 'pending' })
    res.status(200).json(pendingShopOwners)
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Approve shop owner (admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { approval_notes } = req.body

    const shopOwner = await ShopOwner.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approval_date: new Date(),
        approval_notes: approval_notes || '',
      },
      { new: true }
    )

    res.status(200).json({
      message: 'Shop owner approved successfully',
      shop_owner: shopOwner,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Reject shop owner (admin only)
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const { rejection_reason } = req.body

    const shopOwner = await ShopOwner.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        approval_notes: rejection_reason || 'Rejected by admin',
      },
      { new: true }
    )

    res.status(200).json({
      message: 'Shop owner rejected',
      shop_owner: shopOwner,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

export default router
