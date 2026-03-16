require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

// Connect MongoDB right before executing requests in Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    next(err)
  }
})

// Security & middleware
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: function (origin, callback) {
    // Reflect origin dynamically to avoid any Vercel origin mismatch issues
    callback(null, origin || true)
  },
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/client-projects', require('./routes/clientProjects'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/blogs', require('./routes/blogs'))
app.use('/api/about', require('./routes/about'))
app.use('/api/coding', require('./routes/coding'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000

// Only listen locally. Vercel automatically maps the exported Express app to serverless functions.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
  })
}

module.exports = app
