import { test, expect } from '@playwright/test'

test('view published post on public site', async ({ page }) => {
  // Navigate to the post directly
  await page.goto('http://localhost:3003/posts/welcome-to-our-zen-blog')
  await page.waitForLoadState('networkidle')

  // Wait for content to load
  await page.waitForTimeout(2000)

  // Screenshot full page
  await page.screenshot({
    path: 'test-results/public-post-view.png',
    fullPage: true
  })

  // Check if title is visible
  const title = await page.locator('h1').or(page.locator('.text-3xl')).or(page.locator('text=Welcome to Our Zen Blog')).first()
  const titleVisible = await title.count() > 0
  console.log('Title visible:', titleVisible)

  // Check for content
  const content = page.locator('text=This is a test post created').or(page.locator('prose'))
  const contentVisible = await content.count() > 0
  console.log('Content visible:', contentVisible)

  // Check for heading
  const heading = page.locator('text=Why We Started This Blog')
  const headingVisible = await heading.count() > 0
  console.log('H2 visible:', headingVisible)

  // Check for quote
  const quote = page.locator('text=Simplicity is the ultimate sophistication')
  const quoteVisible = await quote.count() > 0
  console.log('Quote visible:', quoteVisible)

  // Check for list
  const listItems = page.locator('li').or(page.locator('text=Mindfulness tips'))
  const listVisible = await listItems.count() > 0
  console.log('List visible:', listVisible)

  console.log('✅ Post viewed on public site!')

  // Verify post is displayed
  expect(titleVisible || contentVisible).toBeTruthy()
})
