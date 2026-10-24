const { expect } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async (page) => {
  await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
  await page.getByRole('button', { name: 'view' }).click()
  await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
  await page.getByRole('button', { name: 'like' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

export { loginWith, createBlog, likeBlog, logout }