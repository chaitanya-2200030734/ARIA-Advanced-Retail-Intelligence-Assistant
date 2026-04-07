import express from 'express'
import User from '../models/User.js'
import { generateToken, verifyToken } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body

    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Create new user (password will be hashed)
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({
      email,
      password: hashedPassword,
      full_name,
      role: email === 'aria@store.ai' ? 'admin' : 'user',
    })

    await newUser.save()

    // Generate token
    const token = generateToken(newUser._id, newUser.email, newUser.role)

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      },
      token,
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role)

    res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET CURRENT USER
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token required' })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    res.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
