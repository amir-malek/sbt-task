import { test, expect } from '@playwright/test'

test.describe('Article Detail Page', () => {
  const realArticleSlug = 'how-to-learn-javascript-efficiently'
  
  test.beforeEach(async ({ page }) => {
    // No mocking needed - use real API
  })

  test('should display article detail correctly', async ({ page }) => {
    await page.goto(`/articles/${realArticleSlug}`)

    // Check main article heading
    await expect(page.getByRole('heading', { name: 'How to Learn JavaScript Efficiently' })).toBeVisible()
    await expect(page.getByText('A comprehensive guide to mastering JavaScript')).toBeVisible()
    
    // Check that markdown content is properly rendered with headings
    await expect(page.getByRole('heading', { name: 'Start with the Fundamentals' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Practice with Real Projects' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Join the Community' })).toBeVisible()
    
    await expect(page.getByText('johndoe')).toBeVisible()
    // Check that favorites section is visible
    await expect(page.locator('.lucide-heart')).toBeVisible()
    
    // Check tags in the tag section
    await expect(page.locator('[data-slot="badge"]', { hasText: 'javascript' })).toBeVisible()
    await expect(page.locator('[data-slot="badge"]', { hasText: 'programming' })).toBeVisible()
  })

  test('should display comments section', async ({ page }) => {
    await page.goto(`/articles/${realArticleSlug}`)

    // Wait for comments to load
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Comments \(\d+\)/)).toBeVisible()
  })

  test('should navigate back to articles', async ({ page }) => {
    await page.goto(`/articles/${realArticleSlug}`)
    await page.waitForLoadState('networkidle')

    await Promise.all([
      page.waitForURL('/articles'),
      page.click('text=Back to Articles')
    ])
    await expect(page).toHaveURL('/articles')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`/articles/${realArticleSlug}`)

    await expect(page.getByRole('heading', { name: 'How to Learn JavaScript Efficiently' })).toBeVisible()
    await expect(page.getByText('johndoe')).toBeVisible()
    
    // Check that markdown headings are visible on mobile
    await expect(page.getByRole('heading', { name: 'Start with the Fundamentals' })).toBeVisible()
    
    // Check that content is readable on mobile
    const articleContent = page.locator('article')
    await expect(articleContent).toBeVisible()
  })

  test('should handle comments refresh', async ({ page }) => {
    await page.goto(`/articles/${realArticleSlug}`)

    // Wait for comments to load
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Comments \(\d+\)/)).toBeVisible()

    // Look for refresh button and click it
    const refreshButton = page.getByRole('button', { name: /refresh/i })
    if (await refreshButton.isVisible()) {
      await refreshButton.click()
      
      // Should still show comments section after refresh
      await expect(page.getByText(/Comments \(\d+\)/)).toBeVisible()
    }
  })
})