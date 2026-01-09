import { test, expect } from '@playwright/test'

test('login attempt', async ({ page }) => {
  await page.goto('http://localhost:3003/login')
  await page.waitForLoadState('networkidle')

  // Fill credentials
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')

  // Screenshot before submit
  await page.screenshot({ path: 'test-results/before-login.png' })

  // Submit
  await page.click('button[type="submit"]')

  // Wait for navigation or error
  await page.waitForTimeout(3000)

  // Screenshot after login attempt
  await page.screenshot({ path: 'test-results/after-login.png' })

  // Check current URL
  console.log('Current URL:', page.url())

  // Check for error message
  const errorElement = page.locator('.text-red-700').or(page.locator('text=Invalid')).or(page.locator('text=Error'))
  const hasError = await errorElement.count() > 0

  if (hasError) {
    const errorText = await errorElement.first().textContent()
    console.log('Login error:', errorText)
  }

  // Check if we're on admin page or still on login
  const isLoggedIn = page.url().includes('/admin')
  console.log('Is logged in:', isLoggedIn)
})
