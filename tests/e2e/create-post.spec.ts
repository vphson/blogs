import { test, expect } from '@playwright/test'

async function login(page) {
  await page.goto('http://localhost:3003/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('create and publish test post', async ({ page }) => {
  await login(page)
  await page.goto('http://localhost:3003/admin/posts/new')
  await page.waitForLoadState('networkidle')

  // Fill in title
  await page.fill('#title', 'Welcome to Our Zen Blog')
  await page.waitForTimeout(1000)

  // Verify slug was auto-generated
  const slugInput = page.locator('#slug')
  const slugValue = await slugInput.inputValue()
  console.log('Generated slug:', slugValue)
  expect(slugValue).toBe('welcome-to-our-zen-blog')

  // Click in editor and type content
  const editor = page.locator('[contenteditable]').first()
  await editor.click()

  // Type first paragraph
  await page.keyboard.type('This is a test post created with Playwright automation. ', { delay: 30 })

  // Add a heading block
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await editor.type('/h2')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('Why We Started This Blog')
  await page.waitForTimeout(300)

  // Add more content
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('We wanted to create a space for mindfulness and simplicity in the digital age. This blog is our attempt to bring some calm to the internet.', { delay: 30 })

  // Add a quote block
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await editor.type('/quote')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('Simplicity is the ultimate sophistication. - Leonardo da Vinci', { delay: 30 })

  // Add a list
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await editor.type('/bullet')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('Mindfulness tips and tricks')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Minimalist living guides')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Zen philosophy insights')
  await page.waitForTimeout(300)

  // Add another heading
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await editor.type('/h3')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('What to Expect')
  await page.waitForTimeout(300)

  // Final paragraph
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  await page.keyboard.type('Thank you for joining us on this journey. We hope you find peace and inspiration in our posts.', { delay: 30 })

  // Screenshot before saving
  await page.screenshot({ path: 'test-results/test-post-filled.png', fullPage: true })

  // Select a category
  const firstCheckbox = page.locator('input[type="checkbox"]').first()
  await firstCheckbox.check()
  await page.waitForTimeout(500)

  // Click publish button
  const publishBtn = page.locator('button:has-text("Đăng bài")')
  await publishBtn.click()

  // Wait for redirect or success
  await page.waitForTimeout(2000)

  // Check if we're redirected to posts list or still on page
  const currentUrl = page.url()
  console.log('Current URL after publish:', currentUrl)

  // Final screenshot
  await page.screenshot({ path: 'test-results/test-post-after-publish.png' })

  // Verify success
  if (currentUrl.includes('/admin/posts')) {
    console.log('✅ Post published successfully! Redirected to posts list.')
  } else {
    console.log('Post form submitted, checking for success messages...')
  }

  expect(currentUrl).toMatch(/admin\/posts/)
})
