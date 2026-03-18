require('dotenv').config({ path: './backend/.env' })
const mongoose = require('mongoose')
const Blog = require('./backend/models/Blog')

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio').then(async () => {
  const blogs = await Blog.find()
  for (let blog of blogs) {
    if (blog.slug && blog.slug.includes('http')) {
      // Create a clean slug from the title manually just in case
      blog.slug = blog.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
    await blog.save()
  }
  console.log('Fixed', blogs.length, 'blogs')
  process.exit(0)
}).catch(console.error)


const fixSlugs = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio')
  const blogs = await Blog.find()
  for (let blog of blogs) {
    if (blog.slug && blog.slug.includes('http')) {
      blog.slug = blog.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
    await blog.save()
  }
  console.log('Fixed', blogs.length, 'blogs')
  process.exit(0)
}

fixSlugs()