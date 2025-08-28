import { render, screen } from '@/lib/utils/test-utils'
import { ArticleCard } from '../ArticleCard'
import type { Article } from '@/types'

const mockArticle: Article = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'This is a test article description',
  body: 'Article body content',
  tagList: ['react', 'testing'],
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  favorited: false,
  favoritesCount: 5,
  author: {
    username: 'testuser',
    bio: 'Test user bio',
    image: 'https://example.com/avatar.jpg',
    following: false,
  },
}

describe('ArticleCard', () => {
  it('should render article information correctly', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test article description')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // Favorites count
  })

  it('should render tags correctly', () => {
    render(<ArticleCard article={mockArticle} />)

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('testing')).toBeInTheDocument()
  })

  it('should limit tag display and show count', () => {
    const articleWithManyTags = {
      ...mockArticle,
      tagList: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    }

    render(<ArticleCard article={articleWithManyTags} />)

    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText('tag4')).not.toBeInTheDocument()
  })

  it('should have correct link href', () => {
    render(<ArticleCard article={mockArticle} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/articles/test-article')
  })

  it('should display formatted date', () => {
    render(<ArticleCard article={mockArticle} />)

    // Should display formatted date - check for any time-based text
    const dateElement = screen.getByText(/ago|years|months|days|hours|minutes|seconds/i)
    expect(dateElement).toBeInTheDocument()
  })
})