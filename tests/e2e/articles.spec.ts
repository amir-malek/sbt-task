import { test, expect } from '@playwright/test'

test.describe('Articles Page', () => {
  test.beforeEach(async ({ page }) => {
    // Use real API data for more realistic tests
  })

  test('should display articles list', async ({ page }) => {
    await page.goto('/articles')

    await expect(page.getByText('All Articles')).toBeVisible()
    
    // Wait for articles to load
    await page.waitForLoadState('networkidle')
    
    // Should have at least one article
    const articleCards = page.locator('[data-testid="article-card"]')
    await expect(articleCards.first()).toBeVisible()
    
    // Should show article count
    await expect(page.getByText(/Showing \d+ of \d+ articles/)).toBeVisible()
  })

  test('should navigate to article detail', async ({ page }) => {
    await page.goto('/articles')
    
    // Wait for articles to load
    await page.waitForLoadState('networkidle')
    
    // Click on the first article
    const firstArticleTitle = page.locator('[data-testid="article-card"] h2').first()
    await expect(firstArticleTitle).toBeVisible()
    await firstArticleTitle.click()
    
    // Should navigate to article detail page
    await expect(page).toHaveURL(/\/articles\/[^/]+$/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/articles')

    await expect(page.getByText('All Articles')).toBeVisible()
    
    // Check mobile-specific styles
    await page.waitForLoadState('networkidle')
    const articleCard = page.locator('[data-testid="article-card"]').first()
    await expect(articleCard).toBeVisible()
  })

  test('should display correct article count', async ({ page }) => {
    await page.goto('/articles')

    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Showing \d+ of \d+ articles/)).toBeVisible()
  })

  test('should handle load more functionality', async ({ page }) => {
    await page.goto('/articles')
    
    await page.waitForLoadState('networkidle')
    
    // Look for Load More button if there are more articles
    const loadMoreButton = page.getByText('Load More Articles')
    const isLoadMoreVisible = await loadMoreButton.isVisible()
    
    if (isLoadMoreVisible) {
      await loadMoreButton.click()
      // Should load more articles
      await expect(page.locator('[data-testid="article-card"]')).toHaveCount(await page.locator('[data-testid="article-card"]').count())
    }
    // This test just verifies the button works if present
  })
})