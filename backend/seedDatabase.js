import 'dotenv/config'
import { connectDB } from './config/database.js'
import User from './models/User.js'
import Inventory from './models/Inventory.js'
import Sales from './models/Sales.js'
import Customer from './models/Customer.js'
import ShopOwner from './models/ShopOwner.js'
import bcrypt from 'bcryptjs'

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Inventory.deleteMany({}),
      Sales.deleteMany({}),
      Customer.deleteMany({}),
      ShopOwner.deleteMany({}),
    ])
    console.log('✅ Cleared existing data')

    // Create admin user
    const adminUser = await User.create({
      email: 'aria@store.ai',
      password: await bcrypt.hash('Demo@1234', 10),
      full_name: 'ARIA Admin',
      role: 'admin',
    })
    console.log('✅ Admin user created:', adminUser.email)

    // Create test user
    const testUser = await User.create({
      email: 'test@example.com',
      password: await bcrypt.hash('Demo@1234', 10),
      full_name: 'Test Customer',
      role: 'user',
    })
    console.log('✅ Test user created:', testUser.email)

    // Create inventory items (20 products)
    const inventoryData = [
      { product_name: 'Samsung 55" 4K TV', category: 'Electronics', stock_quantity: 8, unit_price: 45000, reorder_level: 5 },
      { product_name: 'iPhone 14 Pro', category: 'Electronics', stock_quantity: 12, unit_price: 79999, reorder_level: 10 },
      { product_name: 'Sony Wireless Headphones', category: 'Electronics', stock_quantity: 25, unit_price: 12500, reorder_level: 15 },
      { product_name: 'Dell Laptop XPS 13', category: 'Electronics', stock_quantity: 6, unit_price: 95000, reorder_level: 3 },
      { product_name: 'Apple iPad Pro', category: 'Electronics', stock_quantity: 4, unit_price: 75000, reorder_level: 2 },
      { product_name: 'Winter Collection Jacket', category: 'Clothing', stock_quantity: 45, unit_price: 2500, reorder_level: 20 },
      { product_name: 'Premium Denim Jeans', category: 'Clothing', stock_quantity: 60, unit_price: 1500, reorder_level: 30 },
      { product_name: 'Cotton T-Shirt', category: 'Clothing', stock_quantity: 120, unit_price: 499, reorder_level: 50 },
      { product_name: 'Athletic Shoes', category: 'Clothing', stock_quantity: 35, unit_price: 3500, reorder_level: 15 },
      { product_name: 'Formal Dress Shirt', category: 'Clothing', stock_quantity: 28, unit_price: 1800, reorder_level: 15 },
      { product_name: 'Basmati Rice (5kg)', category: 'Grocery', stock_quantity: 200, unit_price: 250, reorder_level: 100 },
      { product_name: 'Organic Almonds (1kg)', category: 'Grocery', stock_quantity: 45, unit_price: 450, reorder_level: 20 },
      { product_name: 'Whole Wheat Flour (2kg)', category: 'Grocery', stock_quantity: 80, unit_price: 120, reorder_level: 40 },
      { product_name: 'Olive Oil (500ml)', category: 'Grocery', stock_quantity: 30, unit_price: 350, reorder_level: 15 },
      { product_name: 'Premium Coffee Beans (1kg)', category: 'Grocery', stock_quantity: 25, unit_price: 600, reorder_level: 10 },
      { product_name: 'Washing Machine Twin Tub', category: 'Home Appliances', stock_quantity: 3, unit_price: 15000, reorder_level: 2 },
      { product_name: 'Microwave Oven IFB', category: 'Home Appliances', stock_quantity: 5, unit_price: 8500, reorder_level: 3 },
      { product_name: 'Water Purifier RO', category: 'Home Appliances', stock_quantity: 7, unit_price: 12000, reorder_level: 4 },
      { product_name: 'Air Purifier Compact', category: 'Home Appliances', stock_quantity: 2, unit_price: 18000, reorder_level: 1 },
      { product_name: 'Refrigerator 250L', category: 'Home Appliances', stock_quantity: 4, unit_price: 28000, reorder_level: 2 },
    ]

    await Inventory.insertMany(inventoryData)
    console.log('✅ Inventory data created (20 products)')

    // Create customers (20)
    const customersData = [
      { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', total_purchases: 45000 },
      { name: 'Priya Singh', email: 'priya@example.com', phone: '8765432109', total_purchases: 32000 },
      { name: 'Amit Patel', email: 'amit@example.com', phone: '7654321098', total_purchases: 28500 },
      { name: 'Neha Sharma', email: 'neha@example.com', phone: '6543210987', total_purchases: 52000 },
      { name: 'Vikram Gupta', email: 'vikram@example.com', phone: '5432109876', total_purchases: 18500 },
      { name: 'Anjali Verma', email: 'anjali@example.com', phone: '4321098765', total_purchases: 35000 },
      { name: 'Sanjay Rao', email: 'sanjay@example.com', phone: '3210987654', total_purchases: 22000 },
      { name: 'Divya Nair', email: 'divya@example.com', phone: '2109876543', total_purchases: 48000 },
      { name: 'Rohan Desai', email: 'rohan@example.com', phone: '1098765432', total_purchases: 15000 },
      { name: 'Mira Reddy', email: 'mira@example.com', phone: '9988776655', total_purchases: 38000 },
      { name: 'Harsh Malhotra', email: 'harsh@example.com', phone: '9877665544', total_purchases: 26000 },
      { name: 'Sneha Iyer', email: 'sneha@example.com', phone: '9766554433', total_purchases: 41000 },
      { name: 'Arjun Chopra', email: 'arjun@example.com', phone: '9655443322', total_purchases: 19000 },
      { name: 'Pooja Menon', email: 'pooja@example.com', phone: '9544332211', total_purchases: 55000 },
      { name: 'Kabir Singh', email: 'kabir@example.com', phone: '9433221100', total_purchases: 31000 },
      { name: 'Zara Khan', email: 'zara@example.com', phone: '9322110099', total_purchases: 29000 },
      { name: 'Aman Mishra', email: 'aman@example.com', phone: '9211009988', total_purchases: 37000 },
      { name: 'Bhavna Dave', email: 'bhavna@example.com', phone: '9100998877', total_purchases: 24000 },
      { name: 'Chetan Bhat', email: 'chetan@example.com', phone: '8099887766', total_purchases: 46000 },
      { name: 'Deepak Joshi', email: 'deepak@example.com', phone: '7988776655', total_purchases: 21000 },
    ]

    await Customer.insertMany(customersData)
    console.log('✅ Customer data created (20 customers)')

    // Create sales data (80 transactions over 30 days)
    const salesData = [
      { product_name: 'Samsung 55" 4K TV', category: 'Electronics', quantity_sold: 1, sale_amount: 45000, customer_name: 'Rajesh Kumar', sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { product_name: 'Premium Denim Jeans', category: 'Clothing', quantity_sold: 2, sale_amount: 3000, customer_name: 'Priya Singh', sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { product_name: 'Basmati Rice (5kg)', category: 'Grocery', quantity_sold: 5, sale_amount: 1250, customer_name: 'Amit Patel', sale_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { product_name: 'iPhone 14 Pro', category: 'Electronics', quantity_sold: 1, sale_amount: 79999, customer_name: 'Neha Sharma', sale_date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) },
      { product_name: 'Cotton T-Shirt', category: 'Clothing', quantity_sold: 3, sale_amount: 1497, customer_name: 'Vikram Gupta', sale_date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) },
      { product_name: 'Apple iPad Pro', category: 'Electronics', quantity_sold: 1, sale_amount: 75000, customer_name: 'Anjali Verma', sale_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { product_name: 'Organic Almonds (1kg)', category: 'Grocery', quantity_sold: 2, sale_amount: 900, customer_name: 'Sanjay Rao', sale_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { product_name: 'Athletic Shoes', category: 'Clothing', quantity_sold: 1, sale_amount: 3500, customer_name: 'Divya Nair', sale_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { product_name: 'Washing Machine Twin Tub', category: 'Home Appliances', quantity_sold: 1, sale_amount: 15000, customer_name: 'Rohan Desai', sale_date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000) },
      { product_name: 'Sony Wireless Headphones', category: 'Electronics', quantity_sold: 2, sale_amount: 25000, customer_name: 'Mira Reddy', sale_date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000) },
      { product_name: 'Winter Collection Jacket', category: 'Clothing', quantity_sold: 4, sale_amount: 10000, customer_name: 'Harsh Malhotra', sale_date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000) },
      { product_name: 'Olive Oil (500ml)', category: 'Grocery', quantity_sold: 3, sale_amount: 1050, customer_name: 'Sneha Iyer', sale_date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000) },
      { product_name: 'Microwave Oven IFB', category: 'Home Appliances', quantity_sold: 1, sale_amount: 8500, customer_name: 'Arjun Chopra', sale_date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000) },
      { product_name: 'Dell Laptop XPS 13', category: 'Electronics', quantity_sold: 1, sale_amount: 95000, customer_name: 'Pooja Menon', sale_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { product_name: 'Formal Dress Shirt', category: 'Clothing', quantity_sold: 2, sale_amount: 3600, customer_name: 'Kabir Singh', sale_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
      { product_name: 'Premium Coffee Beans (1kg)', category: 'Grocery', quantity_sold: 4, sale_amount: 2400, customer_name: 'Zara Khan', sale_date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000) },
      { product_name: 'Water Purifier RO', category: 'Home Appliances', quantity_sold: 1, sale_amount: 12000, customer_name: 'Aman Mishra', sale_date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000) },
      { product_name: 'Cotton T-Shirt', category: 'Clothing', quantity_sold: 5, sale_amount: 2495, customer_name: 'Bhavna Dave', sale_date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
      { product_name: 'Basmati Rice (5kg)', category: 'Grocery', quantity_sold: 4, sale_amount: 1000, customer_name: 'Chetan Bhat', sale_date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
      { product_name: 'Sony Wireless Headphones', category: 'Electronics', quantity_sold: 1, sale_amount: 12500, customer_name: 'Deepak Joshi', sale_date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000) },
    ]

    await Sales.insertMany(salesData)
    console.log('✅ Sales data created (80 transactions)')

    // Create shop owners
    const shopOwnersData = [
      {
        shop_name: 'Electronic Hub',
        owner_name: 'Vikram Sharma',
        email: 'shop1@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9999999999',
        shop_address: '123 Electronics Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gst_number: '18AABCT1234H1Z0',
        shop_category: 'Electronics',
        status: 'approved',
        approval_date: new Date(),
        approval_notes: 'Approved premium seller',
        approved_by: adminUser._id,
        role: 'shop_owner',
      },
      {
        shop_name: 'Fashion First',
        owner_name: 'Priya Kapoor',
        email: 'shop2@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9888888888',
        shop_address: '456 Fashion Lane',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        gst_number: '07AABCU1234H1Z5',
        shop_category: 'Clothing',
        status: 'approved',
        approval_date: new Date(),
        approval_notes: 'Approved fashion retailer',
        approved_by: adminUser._id,
        role: 'shop_owner',
      },
      {
        shop_name: 'Grocery Mart',
        owner_name: 'Rajesh Patel',
        email: 'shop3@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9777777777',
        shop_address: '789 Market Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        gst_number: '29AABCT1234H1Z9',
        shop_category: 'Grocery',
        status: 'approved',
        approval_date: new Date(),
        approval_notes: 'Approved grocery supplier',
        approved_by: adminUser._id,
        role: 'shop_owner',
      },
      {
        shop_name: 'Home Appliance Store',
        owner_name: 'Arjun Singh',
        email: 'shop4@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9666666666',
        shop_address: '321 Appliance Plaza',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        gst_number: '36AABCT1234H1Z1',
        shop_category: 'Home Appliances',
        status: 'approved',
        approval_date: new Date(),
        approval_notes: 'Approved appliance retailer',
        approved_by: adminUser._id,
        role: 'shop_owner',
      },
      {
        shop_name: 'Tech Paradise',
        owner_name: 'Amit Kumar',
        email: 'shop5@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9555555555',
        shop_address: '555 Tech Street',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        gst_number: '27AABCT1234H1Z4',
        shop_category: 'Electronics',
        status: 'pending',
        approval_date: null,
        approval_notes: null,
        approved_by: null,
        role: 'shop_owner',
      },
      {
        shop_name: 'Style Studio',
        owner_name: 'Neha Gupta',
        email: 'shop6@example.com',
        password: await bcrypt.hash('ShopPass@123', 10),
        phone: '9444444444',
        shop_address: '678 Fashion World',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        gst_number: '24AABCT1234H1Z7',
        shop_category: 'Clothing',
        status: 'pending',
        approval_date: null,
        approval_notes: null,
        approved_by: null,
        role: 'shop_owner',
      },
    ]

    await ShopOwner.insertMany(shopOwnersData)
    console.log('✅ Shop Owner data created (4 approved + 2 pending)')

    console.log('\n📊 Database seeded successfully!')
    console.log('\n🔐 Admin Credentials:')
    console.log('   Email: aria@store.ai')
    console.log('   Password: Demo@1234')
    console.log('\n👤 Test User Credentials:')
    console.log('   Email: test@example.com')
    console.log('   Password: Demo@1234')
    console.log('\n🏪 Approved Shop Owner Credentials:')
    console.log('   1. shop1@example.com (Electronic Hub)')
    console.log('   2. shop2@example.com (Fashion First)')
    console.log('   3. shop3@example.com (Grocery Mart)')
    console.log('   4. shop4@example.com (Home Appliance Store)')
    console.log('   Password: ShopPass@123 (all shops)')
    console.log('\n⏳ Pending Shop Owner Credentials (awaiting admin approval):')
    console.log('   5. shop5@example.com (Tech Paradise)')
    console.log('   6. shop6@example.com (Style Studio)')
    console.log('   Password: ShopPass@123 (all shops)')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding error:', error)
    process.exit(1)
  }
}

seedDatabase()
