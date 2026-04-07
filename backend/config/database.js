import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI
    const dbName = process.env.MONGODB_DB_NAME || 'aria_retail'

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    const connection = await mongoose.connect(mongoUri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })

    console.log(`✅ MongoDB Connected: ${connection.connection.host}`)
    console.log(`📁 Database: ${dbName}`)
    return connection
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

export default connectDB
