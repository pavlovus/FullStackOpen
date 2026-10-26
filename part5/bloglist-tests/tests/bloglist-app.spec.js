const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  describe('Login', () => {
    test('Login succeeds with the correct username/password combination', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('Login fails if the username/password is incorrect', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Superuser logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })

    test('A logged-in user can create a blog', async ({ page }) => {
      await createBlog(page, 'A blog created by playwright', 'Test Author', 'https://test.blog')

      await expect(page.getByText("a new blog 'A blog created by playwright' by Test Author added")).toBeVisible()
      await expect(page.getByRole('link', { name: 'A blog created by playwright' })).toBeVisible()
    })

    test('A logged-in user can like blogs', async ({ page }) => {
      await createBlog(page, 'A blog to like', 'Test Author', 'https://test.blog')

      await page.getByRole('link', { name: 'A blog to like' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('A logged-in user can delete a blog', async ({ page }) => {
      await createBlog(page, 'A blog to delete', 'Test Author', 'https://test.blog')

      await page.getByRole('link', { name: 'A blog to delete' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByRole('link', { name: 'A blog to delete' })).not.toBeVisible()
    })
  })
})