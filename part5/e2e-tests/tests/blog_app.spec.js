const { test, expect, beforeEach, describe } = require('@playwright/test')
import { resetDb, login, addBlog, likeBlog } from './helper'

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await resetDb(request)
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText(/username:/i)).toBeVisible()
    await expect(page.getByText(/password:/i)).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'abcde', 'abcde')
      await expect(page.getByText('User 1 logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'abcde', '12345')
      await expect(page.locator('.error')).toContainText('wrong username or password')
    })
  })

  describe('When user logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'abcde', 'abcde')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'Test blog', 'Tester', 'http://testblog.com')
      await expect(page.getByText('Test blog, Tester')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Test blog', 'Tester', 'http://testblog.com')
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: /view/i }).click()
        await page.getByRole('button', { name: /like/i }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be deleted by creator', async ({ page }) => {
        await page.getByRole('button', { name: /view/i }).click()
        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: /remove/i }).click()
        await expect(page.getByText('Test blog, Tester')).not.toBeVisible()
      })

      test('remove button cannot be seen by other users', async ({ page }) => {
        await page.getByRole('button', { name: /logout/i }).click()
        await login(page, 'fghij', 'fghij')
        await page.getByRole('button', { name: /view/i }).click()
        await expect(page.getByRole('button', { name: /remove/i })).not.toBeVisible()
      })
    })

    describe('When multiple blog exists', () => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Test blog 1', 'Tester', 'http://testblog1.com')
        await addBlog(page, 'Test blog 2', 'Tester', 'http://testblog2.com')
        await addBlog(page, 'Test blog 3', 'Tester', 'http://testblog3.com')
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await page.getByText(/Test blog 1, Tester/).getByRole('button', { name: /view/i }).click()
        await page.getByText(/Test blog 2, Tester/).getByRole('button', { name: /view/i }).click()
        await page.getByText(/Test blog 3, Tester/).getByRole('button', { name: /view/i }).click()

        const likeButton1 = page.getByText(/Test blog 1, Tester/).locator('..').getByRole('button', { name: /like/i})
        const likeButton2 = page.getByText(/Test blog 2, Tester/).locator('..').getByRole('button', { name: /like/i})
        const likeButton3 = page.getByText(/Test blog 3, Tester/).locator('..').getByRole('button', { name: /like/i})

        await likeBlog(likeButton1, 2)
        await likeBlog(likeButton2, 1)
        await likeBlog(likeButton3, 3)

        const blogs = await page.locator('div.blog').all()
        expect(blogs[0]).toContainText('Test blog 3')
        expect(blogs[1]).toContainText('Test blog 1')
        expect(blogs[2]).toContainText('Test blog 2')
      })
    })
  })
})