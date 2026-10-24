const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'sekret'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Superuser1',
        username: 'root1',
        password: 'sekret1'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Please, log in to continue')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('user can log in', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Superuser logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')

      await expect(page.getByText('a new blog \'Test Blog\' by Test Author added')).toBeVisible()
      await expect(page.locator('.blogTitle')).toHaveText('Test Blog')
      await expect(page.locator('.blogAuthor')).toHaveText('Test Author')
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
    })

    describe('and one blog from current user exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test Blog', 'Test Author', 'https://test.blog')
      })

      test('user can like a blog', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('user can remove a blog', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        page.once('dialog', async (dialog) => {
          await dialog.accept();
        });

        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.locator('.blogTitle')).not.toBeVisible()
        await expect(page.locator('.blogAuthor')).not.toBeVisible()
      })
    })

    describe('and one blog from other user exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Other Blog', 'Other Author', 'https://other.blog')
        await expect(page.locator('.blogTitle')).toHaveText('Other Blog')
        await logout(page)
        await loginWith(page, 'root1', 'sekret1')
      })

      test('user cannot remove the blog of other user', async ({ page }) => {
        await expect(page.getByText('Superuser1 logged in')).toBeVisible()
        await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('and multiple blogs exist with different amount of likes', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Blog 1', 'Author 1', 'https://blog1.com')
        await expect(page.locator('.blogTitle')).toHaveText('Blog 1')
        await likeBlog(page)
        await createBlog(page, 'Blog 2', 'Author 2', 'https://blog2.com')
      })

      test('blogs are ordered according to likes in descending order', async ({ page }) => {
        const blogTitles = await page.locator('.blogTitle').allTextContents()
        const blogAuthors = await page.locator('.blogAuthor').allTextContents()
        const blogLikes = await page.locator('.blogLikes').allTextContents()

        const blogs = blogTitles.map((title, i) => ({
          title,
          author: blogAuthors[i],
          likes: parseInt(blogLikes[i].replace(/\D/g, ''), 10)
        }))

        const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

        expect(blogs).toEqual(sortedBlogs)
      })
    })
  })
})