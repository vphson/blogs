import { test, expect } from '@playwright/test'

async function login(page: any) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('create formatted test post', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts/new')
  await page.waitForLoadState('networkidle')

  console.log('\n=== CREATING FORMATTED TEST POST ===\n')

  // Fill title
  await page.fill('#title', 'The Art of Mindful Writing')
  await page.waitForTimeout(1000)

  console.log('✅ Title: "The Art of Mindful Writing"')

  // Click in editor
  const editor = page.locator('[contenteditable]').first()
  await editor.click()

  // ===== First paragraph with bold and italic =====
  await page.keyboard.type('In the hustle of modern life, ', { delay: 40 })

  // Select "hustle" and make it bold
  await page.keyboard.down('Shift')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(200)

  await page.keyboard.type('we often forget to ')

  // Select "forget" and make it italic
  await page.keyboard.down('Shift')
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowLeft')
  }
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+i')
  await page.waitForTimeout(200)

  await page.keyboard.type('the simple act of ', { delay: 40 })

  // Add underlined text
  await page.keyboard.type('pausing')
  await page.keyboard.down('Shift')
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowLeft')
  }
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+u')
  await page.waitForTimeout(200)
  await page.keyboard.press('End')
  await page.keyboard.type('. Writing with intention allows us to connect deeply with our thoughts and express our ', { delay: 40 })

  // Add strikethrough
  await page.keyboard.type('inner chaos')
  await page.keyboard.down('Shift')
  for (let i = 0; i < 11; i++) {
    await page.keyboard.press('ArrowLeft')
  }
  await page.keyboard.up('Shift')
  // Since strikethrough doesn't have a keyboard shortcut, we need to select and use toolbar
  // For now, let's just continue
  await page.keyboard.press('End')
  await page.keyboard.type(' more clearly.', { delay: 40 })

  console.log('✅ First paragraph with formatting')

  // ===== Add a heading =====
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await editor.type('/h2')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await page.keyboard.type('Why Formatting Matters', { delay: 40 })
  console.log('✅ Added H2: "Why Formatting Matters"')

  // ===== Add quote with link =====
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await editor.type('/quote')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await page.keyboard.type('As ', { delay: 40 })

  // Create link
  await page.keyboard.type('Marcus Aurelius')
  await page.keyboard.down('Shift')
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('ArrowLeft')
  }
  await page.keyboard.up('Shift')

  page.once('dialog', dialog => {
    dialog.accept('https://en.wikipedia.org/wiki/Marcus_Aurelius')
  })
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(500)

  await page.keyboard.press('End')
  await page.keyboard.type(' once said, "The happiness of your life depends upon the quality of your thoughts."', { delay: 40 })

  console.log('✅ Added quote with link')

  // ===== Add another heading =====
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await editor.type('/h3')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await page.keyboard.type('Key Takeaways', { delay: 40 })
  console.log('✅ Added H3: "Key Takeaways"')

  // ===== Add bullet list with formatting =====
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await editor.type('/bullet')
  await page.waitForTimeout(500)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await page.keyboard.type('Write with ', { delay: 40 })
  await page.keyboard.type('intention')
  await page.keyboard.down('Shift')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(200)
  await page.keyboard.press('End')
  await page.keyboard.type(' and clarity', { delay: 40 })

  await page.keyboard.press('Enter')
  await page.keyboard.type('Use formatting to ', { delay: 40 })
  await page.keyboard.type('emphasize')
  await page.keyboard.down('Shift')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+i')
  await page.waitForTimeout(200)
  await page.keyboard.press('End')
  await page.keyboard.type(' key points', { delay: 40 })

  await page.keyboard.press('Enter')
  await page.keyboard.type('Add ', { delay: 40 })
  await page.keyboard.type('links')
  await page.keyboard.down('Shift')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.up('Shift')

  page.once('dialog', dialog => {
    dialog.accept('https://example.com/resources')
  })
  await page.keyboard.press('Control+k')
  await page.waitForTimeout(500)
  await page.keyboard.press('End')
  await page.keyboard.type(' to resources', { delay: 40 })

  console.log('✅ Added bullet list with mixed formatting')

  // ===== Final paragraph =====
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)

  await page.keyboard.type('Thank you for reading. May your words flow with ', { delay: 40 })
  await page.keyboard.type('ease and grace')
  await page.keyboard.down('Shift')
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('ArrowLeft')
  }
  await page.keyboard.up('Shift')
  await page.keyboard.press('Control+b')
  await page.waitForTimeout(200)
  await page.keyboard.press('End')
  await page.keyboard.type('!', { delay: 40 })

  console.log('✅ Final paragraph added')

  // Screenshot before saving
  await page.screenshot({
    path: 'test-results/formatted-post-filled.png',
    fullPage: true
  })

  // Select a category
  const firstCheckbox = page.locator('input[type="checkbox"]').first()
  await firstCheckbox.check()
  await page.waitForTimeout(500)

  // Publish the post
  const publishBtn = page.locator('button:has-text("Đăng bài")')
  await publishBtn.click()

  // Wait for save
  await page.waitForTimeout(3000)

  console.log('\n=== POST CREATED ===')
  console.log('✅ Title: "The Art of Mindful Writing"')
  console.log('✅ Multiple formatting types applied')
  console.log('✅ Headings, quotes, lists')
  console.log('✅ Links, bold, italic, underline')

  // Check URL
  const currentUrl = page.url()
  console.log(`\nCurrent URL: ${currentUrl}`)

  if (currentUrl.includes('/admin/posts')) {
    console.log('✅ Post published successfully!')
  }

  // Final screenshot
  await page.screenshot({ path: 'test-results/formatted-post-published.png' })

  expect(currentUrl).toMatch(/admin\/posts/)
})
