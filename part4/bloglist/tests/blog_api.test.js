const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
      assert.strictEqual(titles.includes('I have a dream'), true)
    })

    test('all blogs returned by get have id property', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => {
        assert.ok(blog.id)
      })
    })
  }

  describe('HTTP POST', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 0
      }

      await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('New Blog'))
    })

    test('blog without likes is added with 0 likes', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        url: 'https://example.com',
      }

      await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(b => b.title === 'New Blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'Pavlo Vus',
        url: 'https://example.com',
        likes: 0
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'Pavlo Vus',
        likes: 0
      }

      await api.post('/api/blogs').send(newBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('HTTP DELETE', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
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

after(async () => {
  await mongoose.connection.close()
})