const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

const initialUsers = [
  {
    username: 'root',
    name: 'Root User',
    password: 'sekret'
  },
  {
    username: 'user',
    name: 'Normal User',
    password: 'salainen'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getTokenForUser = async () => {
  const usersAtStart = await usersInDb()
  const user = usersAtStart[0]
  return jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
}


module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb, getTokenForUser
}