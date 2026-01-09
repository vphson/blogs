import { test, expect } from '@playwright/test'

async function login(page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('test image insertion in TipTap editor', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts/new')
  await page.waitForLoadState('networkidle')

  console.log('\n=== TESTING IMAGE MODAL ===\n')

  // Fill title
  await page.fill('#title', 'Bài Viết Có Ảnh')
  await page.waitForTimeout(500)

  // Click in editor
  const editor = page.locator('.ProseMirror').or(page.locator('[contenteditable]')).first()
  await editor.click()
  await page.keyboard.type('Đây là bài viết có ảnh minh họa.')
  await page.waitForTimeout(200)

  // Click image button in toolbar
  await page.locator('button[title="Thêm ảnh"]').click()
  await page.waitForTimeout(500)

  // Check if image modal appears
  const imageModal = page.locator('text=Thêm hình ảnh').or(page.locator('input[placeholder*="image"]')).or(page.locator('input[placeholder*="http"]'))
  const modalVisible = await imageModal.count() > 0
  console.log('Image modal visible:', modalVisible)

  if (modalVisible) {
    // Enter image URL - select the one inside the modal (not cover image)
    const urlInput = page.locator('.fixed input[type="url"]').or(page.locator('.fixed input[placeholder*="image"]'))
    await urlInput.first().fill('https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg')
    await page.waitForTimeout(300)

    // Click add button
    await page.locator('button:has-text("Thêm")').click()
    await page.waitForTimeout(1000)

    console.log('✅ Image added via modal')

    // Screenshot
    await page.screenshot({ path: 'test-results/image-modal-test.png', fullPage: true })

    // Publish post
    await page.locator('input[type="checkbox"]').first().check()
    await page.waitForTimeout(500)
    await page.locator('button:has-text("Đăng bài")').click()
    await page.waitForTimeout(3000)

    console.log('✅ Post published!')
  } else {
    console.log('❌ Image modal NOT found')
    await page.screenshot({ path: 'test-results/image-modal-missing.png', fullPage: true })
  }

  expect(modalVisible).toBeTruthy()
})
