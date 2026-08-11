const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: '67',
    author: 'Pavlo Vus',
    url: 'https://example.com',
    likes: 5
  },
  {
    title: 'I have a dream',
    author: 'Pavlo Vus',
    url: 'https://example.com',
    likes: 10
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}