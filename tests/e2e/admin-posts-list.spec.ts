import { test, expect } from '@playwright/test'

async function login(page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  await page.fill('#email', 'test-admin@example.com')
  await page.fill('#password', 'Test123456')
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin**', { timeout: 10000 })
}

test('view admin posts list', async ({ page }) => {
  await login(page)
  await page.goto('/admin/posts')
  await page.waitForLoadState('networkidle')

  // Wait for posts to load
  await page.waitForTimeout(2000)

  // Screenshot full page
  await page.screenshot({
    path: 'test-results/admin-posts-list.png',
    fullPage: true
  })

  // Count posts in the list
  const postRows = page.locator('tr').or(page.locator('[class*="post"]')).or(page.locator('text=Tịnh lặng'))
  const postCount = await postRows.count()
  console.log(`Posts found in list: ${postCount}`)

  // Look for specific posts
  const posts = [
    'Welcome to Our Zen Blog',
    'Tịnh lặng là sức mạnh',
    'Học cách buông bỏ từ một cốc trà',
    'Ngồi thiền để làm gì?',
    'Bài viết đầu tiên'
  ]

  for (const postTitle of posts) {
    const element = page.locator(`text=${postTitle}`)
    const count = await element.count()
    console.log(`"${postTitle}": ${count > 0 ? '✅ Found' : '❌ Not found'}`)
  }

  // Check for common admin elements
  const createButton = page.locator('text=Create').or(page.locator('text=New Post')).or(page.locator('text=Add'))
  const hasCreateButton = await createButton.count() > 0
  console.log(`Create button: ${hasCreateButton ? '✅' : '❌'}`)

  // Check for status badges
  const statusBadges = page.locator('text=PUBLISHED').or(page.locator('text=DRAFT'))
  const statusCount = await statusBadges.count()
  console.log(`Status badges found: ${statusCount}`)

  console.log('✅ Admin posts list loaded!')
})
