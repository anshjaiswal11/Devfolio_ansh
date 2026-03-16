const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../server')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_test')
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
  }
  let token

  it('POST /api/auth/signup — should create a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser)
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(testUser.email)
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('POST /api/auth/signup — should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser)
    expect(res.statusCode).toBe(409)
  })

  it('POST /api/auth/login — should authenticate with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    token = res.body.token
  })

  it('POST /api/auth/login — should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPassword!',
    })
    expect(res.statusCode).toBe(401)
  })

  it('GET /api/auth/profile — should return user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe(testUser.email)
  })

  it('GET /api/auth/profile — should reject without token', async () => {
    const res = await request(app).get('/api/auth/profile')
    expect(res.statusCode).toBe(401)
  })
})

describe('Projects API', () => {
  it('GET /api/projects — should return array of projects', async () => {
    const res = await request(app).get('/api/projects')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('projects')
    expect(Array.isArray(res.body.projects)).toBe(true)
  })
})

describe('Health check', () => {
  it('GET /api/health — should return ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
