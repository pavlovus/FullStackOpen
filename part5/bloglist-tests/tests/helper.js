const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  if (!page.url().includes('/login')) {
    await page.getByRole('link', { name: 'login' }).click()
  }
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async (page, title) => {
  if (title) {
    await page.getByRole('link', { name: title }).click()
  }
  await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
  await page.getByRole('button', { name: 'like' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

export { loginWith, createBlog, likeBlog, logout }