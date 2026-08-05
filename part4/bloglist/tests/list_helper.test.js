const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty array is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has one blog, equals the likes of that blog', () => {
    const blog = { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 }
    assert.strictEqual(listHelper.totalLikes([blog]), blog.likes)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', url: 'http://example.com', likes: 15 },
    ]
    assert.strictEqual(listHelper.totalLikes(blogs), blogs.reduce((sum, blog) => sum + blog.likes, 0))
  })
})

describe('favorite blog', () => {
  test('of empty array is undefined', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), undefined)
  })

  test('when list has one blog, equals the likes of that blog', () => {
    const blog = { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 }
    assert.deepStrictEqual(listHelper.favoriteBlog([blog]), blog)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', url: 'http://example.com', likes: 15 },
    ]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })

  test('when list has few maximum equals return the first one', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 3', url: 'http://example.com', likes: 15 },
      { title: 'Blog 4', author: 'Author 4', url: 'http://example.com', likes: 15 },
      { title: 'Blog 5', author: 'Author 5', url: 'http://example.com', likes: 10 },
      { title: 'Blog 6', author: 'Author 6', url: 'http://example.com', likes: 15 }
    ]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })
})

describe('most blogs', () => {
  test('of empty array is undefined', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), undefined)
  })

  test('when list has one blog, equals the author of that blog', () => {
    const blog = { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 }
    assert.deepStrictEqual(listHelper.mostBlogs([blog]), { author: 'Author 1', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com', likes: 15 },
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: 'Author 1', blogs: 2 })
  })

  test('when list has few maximum equals return the first one', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com', likes: 15 },
      { title: 'Blog 4', author: 'Author 3', url: 'http://example.com', likes: 15 },
      { title: 'Blog 5', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 6', author: 'Author 4', url: 'http://example.com', likes: 15 }
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: 'Author 1', blogs: 2 })
  })
})

describe('most likes', () => {
  test('of empty array is undefined', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), undefined)
  })

  test('when list has one blog, equals the author of that blog', () => {
    const blog = { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 }
    assert.deepStrictEqual(listHelper.mostLikes([blog]), { author: 'Author 1', totalLikes: 5 })
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com', likes: 15 },
    ]
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: 'Author 1', totalLikes: 20 })
  })

  test('when list has few maximum equals return the first one', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'http://example.com', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 3', author: 'Author 1', url: 'http://example.com', likes: 15 },
      { title: 'Blog 4', author: 'Author 3', url: 'http://example.com', likes: 15 },
      { title: 'Blog 5', author: 'Author 2', url: 'http://example.com', likes: 10 },
      { title: 'Blog 6', author: 'Author 4', url: 'http://example.com', likes: 15 }
    ]
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: 'Author 1', totalLikes: 20 })
  })
})