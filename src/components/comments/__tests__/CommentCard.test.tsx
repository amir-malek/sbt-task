import { render, screen } from '@/lib/utils/test-utils'
import { CommentCard } from '../CommentCard'
import type { Comment } from '@/types'

const mockComment: Comment = {
  id: 1,
  body: 'This is a great article! Thanks for sharing.',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  author: {
    username: 'testuser',
    bio: 'Test user bio',
    image: 'https://example.com/avatar.jpg',
    following: false,
  },
}

describe('CommentCard', () => {
  it('should render comment content correctly', () => {
    render(<CommentCard comment={mockComment} />)

    expect(screen.getByText('This is a great article! Thanks for sharing.')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('should render formatted date', () => {
    render(<CommentCard comment={mockComment} />)

    // Should display formatted date - check for any time-based text
    const dateElement = screen.getByText(/ago|years|months|days|hours|minutes|seconds/i)
    expect(dateElement).toBeInTheDocument()
  })

  it('should render author avatar with fallback', () => {
    render(<CommentCard comment={mockComment} />)

    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('alt', 'testuser')
  })

  it('should handle missing author image gracefully', () => {
    const commentWithoutImage = {
      ...mockComment,
      author: {
        ...mockComment.author,
        image: '',
      },
    }

    render(<CommentCard comment={commentWithoutImage} />)

    // Should still render the comment content
    expect(screen.getByText('This is a great article! Thanks for sharing.')).toBeInTheDocument()
  })

  it('should handle long comment content', () => {
    const longComment = {
      ...mockComment,
      body: 'This is a very long comment that should be handled properly. '.repeat(10),
    }

    render(<CommentCard comment={longComment} />)

    // Check for partial content since long text might be split across elements
    expect(screen.getByText(/This is a very long comment/)).toBeInTheDocument()
  })
})