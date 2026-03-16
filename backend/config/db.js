const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using cached MongoDB connection')
    return
  }

  if (!process.env.MONGO_URI && process.env.VERCEL) {
    console.error('❌ FATAL ERROR: MONGO_URI is missing in Vercel Environment Variables.')
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio', {
      serverSelectionTimeoutMS: 5000,
    })
    
    isConnected = db.connections[0].readyState === 1
    console.log(`✅ MongoDB newly connected: ${db.connection.host}`)
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`)
    console.error('👉 Ensure MONGO_URI is in Vercel, and Atlas Network Access allows 0.0.0.0/0')
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1)
    }
    throw err
  }
}

module.exports = connectDB
