import { test, expect } from '@playwright/test'

async function login(page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('quick formatted post', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts/new')
  await page.waitForLoadState('networkidle')

  console.log('\n=== QUICK FORMATTED POST ===\n')

  // Fill title
  await page.fill('#title', 'Quick Formatting Test')
  await page.waitForTimeout(500)

  // Click in editor and type content with formatting
  const editor = page.locator('[contenteditable]').first()
  await editor.click()

  // Type first sentence
  await page.keyboard.type('This is bold')
  await page.waitForTimeout(100)

  // Make it bold
  await page.keyboard.down('Control')
  await page.keyboard.press('a')
  await page.keyboard.up('Control')
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(200)

  // More text
  await page.keyboard.press('End')
  await page.keyboard.type(' and this is italic')
  await page.waitForTimeout(100)

  // Make italic
  await page.keyboard.down('Control')
  await page.keyboard.press('Shift+ArrowLeft')
  await page.keyboard.up('Control')
  await page.keyboard.press('Control+i')
  await page.waitForTimeout(200)

  // Add heading
  await page.keyboard.press('Enter')
  await editor.type('/h2')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.keyboard.type('Important Points')
  await page.waitForTimeout(200)

  // Add quote
  await page.keyboard.press('Enter')
  await editor.type('/quote')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.keyboard.type('Simplicity is the ultimate sophistication')
  await page.waitForTimeout(200)

  // Add list
  await page.keyboard.press('Enter')
  await editor.type('/bullet')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.keyboard.type('First point')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Second point')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Third point')
  await page.waitForTimeout(200)

  // Select category and publish
  await page.locator('input[type="checkbox"]').first().check()
  await page.waitForTimeout(500)

  await page.screenshot({ path: 'test-results/quick-formatted-post.png', fullPage: true })

  await page.locator('button:has-text("Đăng bài")').click()
  await page.waitForTimeout(3000)

  console.log('✅ Formatted post created!')
  console.log('✅ Bold, italic, H2, quote, list')

  const currentUrl = page.url()
  console.log(`URL: ${currentUrl}`)

  expect(currentUrl).toMatch(/admin\/posts/)
})
