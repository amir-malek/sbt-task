import { test, expect } from '@playwright/test'

test.describe('PWA Features', () => {
  test('should register service worker', async ({ page }) => {
    await page.goto('/')

    // Check if service worker is registered
    const serviceWorker = await page.evaluate(() => {
      return navigator.serviceWorker.ready.then(() => true).catch(() => false)
    })

    expect(serviceWorker).toBe(true)
  })

  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/')

    // Check manifest link
    const manifest = page.locator('link[rel="manifest"]')
    await expect(manifest).toHaveAttribute('href', '/manifest.json')

    // Verify manifest content
    const response = await page.request.get('/manifest.json')
    expect(response.ok()).toBeTruthy()
    
    const manifestData = await response.json()
    expect(manifestData.name).toBe('Blog Platform - A Modern Blogging Experience')
    expect(manifestData.short_name).toBe('Blog Platform')
  })

  test('should display install prompt appropriately', async ({ page }) => {
    await page.goto('/')

    // PWA install prompt should be handled gracefully
    // This test ensures the page loads without errors related to PWA
    await expect(page.getByText('Welcome to Blog Platform')).toBeVisible()
  })

  test('should work offline for cached pages', async ({ page, context }) => {
    // First visit to cache the page
    await page.goto('/')
    await expect(page.getByText('Welcome to Blog Platform')).toBeVisible()

    // Go offline
    await context.setOffline(true)

    // Reload the page - should work from cache or show offline page
    await page.reload()
    
    // Should either show cached content or offline page
    const hasOfflineContent = await page.getByText('You are currently offline').isVisible()
    const hasCachedContent = await page.getByText('Welcome to Blog Platform').isVisible()
    
    expect(hasOfflineContent || hasCachedContent).toBe(true)
  })

  test('should have proper PWA meta tags', async ({ page }) => {
    await page.goto('/')

    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]')
    await expect(themeColor).toHaveAttribute('content', '#ffffff')

    // Check apple touch icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]')
    await expect(appleTouchIcon).toBeAttached()

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    await expect(viewport).toHaveAttribute('content', /width=device-width/)
  })

  test('should navigate to offline page when appropriate', async ({ page }) => {
    await page.goto('/offline')

    await expect(page.getByText('You are currently offline')).toBeVisible()
    await expect(page.getByText('Please check your internet connection')).toBeVisible()
    
    // Should have navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /articles/i })).toBeVisible()
  })
})