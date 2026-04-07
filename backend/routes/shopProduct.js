import express from 'express'
import ShopProduct from '../models/ShopProduct.js'

const router = express.Router()

// Get all active products (for users to browse)
router.get('/', async (req, res) => {
  try {
    console.log('[ShopProduct GET /] Request received')
    const { category, search } = req.query
    console.log('[ShopProduct GET /] Filters - Category:', category, 'Search:', search)

    let query = { status: 'active' }

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.product_name = { $regex: search, $options: 'i' }
    }

    console.log('[ShopProduct GET /] Query:', JSON.stringify(query))
    const products = await ShopProduct.find(query).sort({ created_at: -1 })
    console.log('[ShopProduct GET /] Found', products.length, 'products')
    res.status(200).json(products)
  } catch (error) {
    console.error('[ShopProduct GET /] Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Add product (shop owner only)
router.post('/add', async (req, res) => {
  try {
    console.log('[ShopProduct POST /add] Received request')
    const {
      shop_id,
      shop_name,
      product_name,
      category,
      description,
      unit_price,
      stock_quantity,
      sku,
      image_url,
    } = req.body

    console.log('[ShopProduct POST /add] Data:', {
      shop_id,
      shop_name,
      product_name,
      category,
      unit_price,
      stock_quantity,
    })

    // Validate required fields
    if (!shop_id || !product_name || !category || !unit_price || stock_quantity === undefined) {
      console.log('[ShopProduct POST /add] Validation failed')
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create new product
    const newProduct = await ShopProduct.create({
      shop_id,
      shop_name,
      product_name,
      category,
      description: description || '',
      unit_price,
      stock_quantity,
      sku: sku || `SKU-${Date.now()}`,
      image_url: image_url || null,
      status: 'active',
    })

    console.log('[ShopProduct POST /add] Product created:', {
      _id: newProduct._id,
      product_name: newProduct.product_name,
      status: newProduct.status,
      shop_id: newProduct.shop_id,
    })

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    })
  } catch (error) {
    console.error('[ShopProduct POST /add] Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Get all products for a shop owner
router.get('/shop/:shop_id', async (req, res) => {
  try {
    const { shop_id } = req.params

    const products = await ShopProduct.find({ shop_id })
    res.status(200).json(products)
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Get single product
router.get('/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params

    const product = await ShopProduct.findById(product_id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Update product
router.put('/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params
    const { product_name, category, description, unit_price, stock_quantity, status } = req.body

    const product = await ShopProduct.findByIdAndUpdate(
      product_id,
      {
        product_name,
        category,
        description,
        unit_price,
        stock_quantity,
        status,
        updated_at: new Date(),
      },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Delete product
router.delete('/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params

    const product = await ShopProduct.findByIdAndDelete(product_id)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product,
    })
  } catch (error) {
    console.error('ARIA API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

export default router
