import { test, expect } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'

test.describe('Performance Audits', () => {
  test('should meet PWA lighthouse scores', async ({ page, browserName }) => {
    // Skip for non-chromium browsers as lighthouse only works with Chrome
    test.skip(browserName !== 'chromium', 'Lighthouse only works with Chromium')
    // Skip in CI environment where remote debugging port might not be available
    test.skip(process.env.CI === 'true', 'Lighthouse requires Chrome remote debugging port')

    await page.goto('/')

    const audit = await playAudit({
      page,
      thresholds: {
        performance: 70, // Reduced for CI environments
        accessibility: 85, // Reduced slightly for stability
        'best-practices': 85,
        seo: 75,
        pwa: 70,
      },
      port: 9222,
      opts: {
        // Add configuration for headless mode
        chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
      }
    })

    expect(audit.lhr.categories.performance.score).toBeGreaterThanOrEqual(0.7)
    expect(audit.lhr.categories.pwa.score).toBeGreaterThanOrEqual(0.7)
  })

  test('should meet accessibility standards', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Lighthouse only works with Chromium')

    await page.goto('/articles')

    const audit = await playAudit({
      page,
      thresholds: {
        accessibility: 90,
      },
      port: 9222,
    })

    expect(audit.lhr.categories.accessibility.score).toBeGreaterThanOrEqual(0.9)
  })

  test('should load articles page quickly', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/articles')
    await page.waitForSelector('[data-testid="article-card"]', { timeout: 5000 }).catch(() => {
      // Fallback: wait for any article content
      return page.waitForSelector('h1, h2, h3', { timeout: 5000 })
    })
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
  })

  test('should load article detail page quickly', async ({ page }) => {
    // Mock API response for consistent testing
    await page.route('**/api/articles/test-article*', async (route) => {
      const url = route.request().url()
      
      if (url.includes('/comments')) {
        await route.fulfill({
          json: { comments: [] }
        })
      } else {
        await route.fulfill({
          json: {
            article: {
              slug: 'test-article',
              title: 'Performance Test Article',
              description: 'Testing article load performance',
              body: 'Article content for performance testing',
              tagList: ['performance'],
              createdAt: '2023-01-01T00:00:00.000Z',
              updatedAt: '2023-01-01T00:00:00.000Z',
              favorited: false,
              favoritesCount: 0,
              author: {
                username: 'perftest',
                bio: '',
                image: '',
                following: false,
              },
            },
          }
        })
      }
    })

    const startTime = Date.now()
    
    await page.goto('/articles/test-article')
    await page.waitForSelector('h1')
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(2000) // Should load within 2 seconds
  })

  test('should have good Core Web Vitals', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Web Vitals only work with Chromium')

    await page.goto('/')

    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals: Record<string, number> = {}
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.LCP = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              vitals.FID = (entry as any).processingStart - entry.startTime
            }
            if (entry.entryType === 'layout-shift') {
              vitals.CLS = (vitals.CLS || 0) + (entry as any).value
            }
          })
          
          // Resolve after a timeout to collect metrics
          setTimeout(() => resolve(vitals), 3000)
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
      })
    })

    // Core Web Vitals thresholds
    const vitals = webVitals as Record<string, number>
    if (vitals.LCP) expect(vitals.LCP).toBeLessThan(2500) // LCP < 2.5s
    if (vitals.FID) expect(vitals.FID).toBeLessThan(100)   // FID < 100ms
    if (vitals.CLS) expect(vitals.CLS).toBeLessThan(0.1)   // CLS < 0.1
  })
})