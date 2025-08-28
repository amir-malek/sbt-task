import { render, screen } from '@/lib/utils/test-utils'
import { LoadingSpinner, ArticleListSkeleton } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render with default size', () => {
    render(<LoadingSpinner />)

    const container = screen.getByRole('progressbar')
    expect(container).toBeInTheDocument()
    const spinner = container.querySelector('div')
    expect(spinner).toHaveClass('h-8', 'w-8')
  })

  it('should render with small size', () => {
    render(<LoadingSpinner size="sm" />)

    const container = screen.getByRole('progressbar')
    const spinner = container.querySelector('div')
    expect(spinner).toHaveClass('h-4', 'w-4')
  })

  it('should render with large size', () => {
    render(<LoadingSpinner size="lg" />)

    const container = screen.getByRole('progressbar')
    const spinner = container.querySelector('div')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-class" />)

    const container = screen.getByRole('progressbar')
    expect(container).toHaveClass('custom-class')
  })
})

describe('ArticleListSkeleton', () => {
  it('should render skeleton items', () => {
    render(<ArticleListSkeleton />)

    // Should render skeleton items - check for skeleton elements
    const skeletons = screen.getAllByTestId(/skeleton/i)
    expect(skeletons.length).toBeGreaterThan(0)
  })
})