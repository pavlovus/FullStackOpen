const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog controller', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Root User', passwordHash })
    const savedUser = await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id })))
  })

  describe('HTTP GET'), () => {
    test('blogs are returned as json', async () => {
      await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')

      const titles = response.body.map(e => e.title)
      assert.strictEqual(titles.includes(helper.initialBlogs[0].title), true)
    })

    test('all blogs returned by get have id property', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => { assert.ok(blog.id) })
    })
  }

  describe('HTTP POST', () => {
    test('a valid blog can be added ', async () => {
      const token = await helper.getTokenForUser()
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 0,
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('New Blog'))
    })

    test('blog without likes is added with 0 likes', async () => {
      const token = await helper.getTokenForUser()
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(b => b.title === 'New Blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title is not added', async () => {
      const token = await helper.getTokenForUser()
      const newBlog = {
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 0
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const token = await helper.getTokenForUser()
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        likes: 0
      }

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a request without token is rejected', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 0,
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('HTTP DELETE', () => {
    test('a blog can be deleted', async () => {
      const token = await helper.getTokenForUser()
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('a request without token is rejected', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('HTTP PUT', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'Updated Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 5
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(updatedBlogInDb, { ...blogToUpdate, ...updatedBlog })
    })

    test('updating with invalid amount of likes returns 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'Updated Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: -1
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(updatedBlogInDb, blogToUpdate)
    })

    test('updating with invalid url returns 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'Updated Blog',
        author: 'Pavlo Vus',
        url: 'invalid-url',
        likes: 5
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(updatedBlogInDb, blogToUpdate)
    })

    test('updating with missing title returns 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 5
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(updatedBlogInDb, blogToUpdate)
    })

    test('updating with missing url returns 400', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'Updated Blog',
        author: 'Pavlo Vus',
        likes: 5
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(updatedBlogInDb, blogToUpdate)
    })
  })
})

describe('User controller', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (const user of helper.initialUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      const userToSave = new User({ ...user, passwordHash })
      await userToSave.save()
    }
  })

  describe('HTTP GET', () => {
    test('users are returned as json', async () => {
      await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    })

    test('all users are returned', async () => {
      const response = await api.get('/api/users')
      assert.strictEqual(response.body.length, helper.initialUsers.length)
    })

    test('a specific user is within the returned users', async () => {
      const response = await api.get('/api/users')

      const names = response.body.map(e => e.name)
      assert.strictEqual(names.includes(helper.initialUsers[0].name), true)
    })

    test('all users returned by get have id property', async () => {
      const response = await api.get('/api/users')
      response.body.forEach(user => { assert.ok(user.id) })
    })
  })

  describe('HTTP POST', () => {
    test('a valid user can be added ', async () => {
      const newUser = {
        username: 'NewUser',
        name: 'New User',
        password: 'password'
      }

      await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes('NewUser'))
    })

    test('user without username is not added', async () => {
      const newUser = {
        name: 'New User',
        password: 'password'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('user with username shorter than 3 symbols is not added', async () => {
      const newUser = {
        username: 'ab',
        name: 'New User',
        password: 'password'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('user with existing username is not added', async () => {
      const existingUser = { ...helper.initialUsers[0], name: 'newName' }

      await api.post('/api/users').send(existingUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('user without password is not added', async () => {
      const newUser = {
        username: 'NewUser',
        name: 'New User'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })

    test('user with password shorter than 3 symbols is not added', async () => {
      const newUser = {
        username: 'NewUser',
        name: 'New User',
        password: '12'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})