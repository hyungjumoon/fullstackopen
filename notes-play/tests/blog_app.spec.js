const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Super User',
        username: 'root',
        password: 'password'
      }
    })

    await page.goto('')
  })

  /*test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    const button = await page.getByRole('button', { name: 'login' })
    await expect(button).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
  
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })*/
  
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    /*
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'hello there', 'playwright', 'https://playwright.dev/', true)
      await expect(page.getByText('hello there playwright view')).toBeVisible()
    })*/

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'hello there', 'playwright', 'https://playwright.dev/', true)
      })
  
      /*test('like button works as intended', async ({ page }) => {
        await page.pause()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 like')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('2 like')).toBeVisible()
      })*/

      test('remove button works as intended', async ({ page }) => {
        await page.pause()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        // await expect(page.getByText('hello there playwright')).not.toBeVisible()
      })
    })
  })  
})