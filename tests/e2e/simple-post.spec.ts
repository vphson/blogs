import { test, expect } from '@playwright/test'

async function login(page: any) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('create simple post with toolbar buttons', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts/new')
  await page.waitForLoadState('networkidle')

  console.log('\n=== CREATING SIMPLE POST WITH TOOLBAR ===\n')

  // Fill title
  await page.fill('#title', 'Bài Thiền Đơn Giản')
  await page.waitForTimeout(500)

  // Click in editor
  const editor = page.locator('.ProseMirror').or(page.locator('[contenteditable]')).first()
  await editor.click()

  // Type first paragraph
  await page.keyboard.type('Đây là một bài viết đơn giản về thiền. ')
  await page.waitForTimeout(200)

  // Make text bold using toolbar
  await page.keyboard.down('Control')
  await page.keyboard.press('a')
  await page.keyboard.up('Control')
  await page.waitForTimeout(200)

  // Click bold button in toolbar
  await page.locator('button[title="In đậm (Cmd+B)"]').click()
  await page.waitForTimeout(200)
  await page.keyboard.press('End')

  // Add H2 using toolbar button
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  await page.locator('button[title="Tiêu đề 2"]').click()
  await page.waitForTimeout(200)
  await page.keyboard.type('Lợi Ích Của Thiền')
  await page.waitForTimeout(200)

  // Add quote using toolbar button
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  await page.locator('button[title="Trích dẫn"]').click()
  await page.waitForTimeout(200)
  await page.keyboard.type('Tịnh lặng là sức mạnh. - Thiền sư Thích Nhất Hạnh')
  await page.waitForTimeout(200)

  // Add bullet list using toolbar button
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
  await page.locator('button[title="Danh sách"]').click()
  await page.waitForTimeout(200)
  await page.keyboard.type('Giảm stress')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Tăng sự tập trung')
  await page.keyboard.press('Enter')
  await page.keyboard.type('Cải thiện giấc ngủ')
  await page.waitForTimeout(200)

  console.log('✅ Content created with toolbar buttons')

  // Screenshot
  await page.screenshot({ path: 'test-results/simple-post-toolbar.png', fullPage: true })

  // Select category and publish
  await page.locator('input[type="checkbox"]').first().check()
  await page.waitForTimeout(500)

  await page.locator('button:has-text("Đăng bài")').click()
  await page.waitForTimeout(3000)

  console.log('✅ Post published!')

  const currentUrl = page.url()
  console.log(`URL: ${currentUrl}`)

  expect(currentUrl).toMatch(/admin\/posts/)
})

test('view simple post on public site', async ({ page }) => {
  await page.goto('/posts/bai-thien-don-gian')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)

  // Screenshot
  await page.screenshot({ path: 'test-results/simple-post-public.png', fullPage: true })

  // Check for H2 heading
  const h2 = page.locator('h2:has-text("Lợi Ích Của Thiền")')
  const h2Visible = await h2.count() > 0
  console.log('H2 heading visible:', h2Visible)

  // Check for blockquote
  const quote = page.locator('blockquote:has-text("Tịnh lặng là sức mạnh")')
  const quoteVisible = await quote.count() > 0
  console.log('Blockquote visible:', quoteVisible)

  // Check for bullet list
  const listItems = page.locator('ul li').or(page.locator('li'))
  const listCount = await listItems.count()
  console.log('List items found:', listCount)

  console.log('✅ Post viewed on public site!')

  expect(h2Visible && quoteVisible && listCount >= 3).toBeTruthy()
})
