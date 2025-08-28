import { test, expect } from '@playwright/test'

test.describe('Article Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock article detail API
    await page.route('**/api/articles/test-article', async (route) => {
      const json = {
        article: {
          slug: 'test-article',
          title: 'Test Article Detail',
          description: 'Detailed test article description',
          body: 'This is the full content of the test article. It contains multiple paragraphs.\n\nThis is the second paragraph of the article.',
          tagList: ['react', 'next.js', 'testing'],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          favorited: false,
          favoritesCount: 12,
          author: {
            username: 'articleauthor',
            bio: 'Professional writer',
            image: 'https://api.realworld.io/images/demo-avatar.png',
            following: false,
          },
        },
      }
      await route.fulfill({ json })
    })

    // Mock comments API
    await page.route('**/api/articles/test-article/comments', async (route) => {
      const json = {
        comments: [
          {
            id: 1,
            body: 'Great article! Very informative.',
            createdAt: '2023-01-02T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
            author: {
              username: 'commenter1',
              bio: 'Reader',
              image: 'https://api.realworld.io/images/demo-avatar.png',
              following: false,
            },
          },
        ],
      }
      await route.fulfill({ json })
    })
  })

  test('should display article detail correctly', async ({ page }) => {
    await page.goto('/articles/test-article')

    await expect(page.getByText('Test Article Detail')).toBeVisible()
    await expect(page.getByText('Detailed test article description')).toBeVisible()
    await expect(page.getByText('This is the full content')).toBeVisible()
    await expect(page.getByText('articleauthor')).toBeVisible()
    await expect(page.getByText('❤️ 12')).toBeVisible()
    
    // Check tags
    await expect(page.getByText('react')).toBeVisible()
    await expect(page.getByText('next.js')).toBeVisible()
    await expect(page.getByText('testing')).toBeVisible()
  })

  test('should display comments section', async ({ page }) => {
    await page.goto('/articles/test-article')

    await expect(page.getByText('Comments (1)')).toBeVisible()
    await expect(page.getByText('Great article! Very informative.')).toBeVisible()
    await expect(page.getByText('commenter1')).toBeVisible()
  })

  test('should navigate back to articles', async ({ page }) => {
    await page.goto('/articles/test-article')

    await page.click('text=← Back to Articles')
    await expect(page).toHaveURL('/articles')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/articles/test-article')

    await expect(page.getByText('Test Article Detail')).toBeVisible()
    await expect(page.getByText('articleauthor')).toBeVisible()
    
    // Check that content is readable on mobile
    const articleContent = page.locator('article')
    await expect(articleContent).toBeVisible()
  })

  test('should handle comments refresh', async ({ page }) => {
    await page.goto('/articles/test-article')

    // Wait for comments to load
    await expect(page.getByText('Comments (1)')).toBeVisible()

    // Look for refresh button and click it
    const refreshButton = page.getByRole('button', { name: /refresh/i })
    if (await refreshButton.isVisible()) {
      await refreshButton.click()
      
      // Should still show comments after refresh
      await expect(page.getByText('Great article! Very informative.')).toBeVisible()
    }
  })
})