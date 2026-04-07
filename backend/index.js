import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.js'
import shopOwnerRoutes from './routes/shopOwner.js'
import shopProductRoutes from './routes/shopProduct.js'
import chatRoutes from './routes/chat.js'
import transcribeRoutes from './routes/transcribe.js'
import inventoryRoutes from './routes/inventory.js'
import salesRoutes from './routes/sales.js'
import customersRoutes from './routes/customers.js'
import insightsRoutes from './routes/insights.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

// Connect to MongoDB
connectDB()

// Auth routes (no authentication needed)
app.use('/api/auth', authRoutes)
app.use('/api/shop-owner', shopOwnerRoutes)

// Shop product routes
app.use('/api/shop-products', shopProductRoutes)

// Protected routes
app.use('/api/chat', chatRoutes)
app.use('/api/transcribe', transcribeRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/insights', insightsRoutes)

app.get('/api/health', (req, res) =>
  res.json({ status: 'ARIA backend online', timestamp: new Date() })
)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`ARIA backend running on port ${PORT}`))
