import { test, expect } from '@playwright/test'

test.describe('Articles Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('**/api/articles*', async (route) => {
      const json = {
        articles: [
          {
            slug: 'test-article-1',
            title: 'Test Article 1',
            description: 'This is a test article',
            body: 'Test article body content',
            tagList: ['react', 'testing'],
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            favorited: false,
            favoritesCount: 5,
            author: {
              username: 'testuser',
              bio: 'Test user',
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
        ],
        articlesCount: 1,
      }
      await route.fulfill({ json })
    })
  })

  test('should display articles list', async ({ page }) => {
    await page.goto('/articles')

    await expect(page.getByText('All Articles')).toBeVisible()
    await expect(page.getByText('Test Article 1')).toBeVisible()
    await expect(page.getByText('This is a test article')).toBeVisible()
    await expect(page.getByText('testuser')).toBeVisible()
    await expect(page.getByText('react')).toBeVisible()
    await expect(page.getByText('❤️ 5')).toBeVisible()
  })

  test('should navigate to article detail', async ({ page }) => {
    await page.goto('/articles')

    await page.click('text=Test Article 1')
    await expect(page).toHaveURL('/articles/test-article-1')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/articles')

    await expect(page.getByText('Test Article 1')).toBeVisible()
    
    // Check mobile-specific styles
    const articleCard = page.locator('[data-testid="article-card"]').first()
    await expect(articleCard).toBeVisible()
  })

  test('should display correct article count', async ({ page }) => {
    await page.goto('/articles')

    await expect(page.getByText('Showing 1 of 1 articles')).toBeVisible()
  })

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/articles*', async (route) => {
      await route.fulfill({ json: { articles: [], articlesCount: 0 } })
    })

    await page.goto('/articles')

    await expect(page.getByText('No articles found')).toBeVisible()
  })
})