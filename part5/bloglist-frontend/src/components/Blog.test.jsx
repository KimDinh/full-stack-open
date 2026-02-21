import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, test } from 'vitest'
import Blog from './Blog'

describe('<Blog/>', () => {
  const blog = {
    title: 'Test blog',
    url: 'http://testblog.com',
    author: 'Tester',
    likes: 3,
    user: {
      username: 'tester',
      name: 'Tester'
    }
  }

  const handleLikeBlog = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} handleLikeBlog={handleLikeBlog} handleDelete={vi.fn()} />)
  })

  test('renders title and author by default', () => {
    expect(screen.queryByText(blog.title, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(blog.url, { exact: false })).not.toBeInTheDocument()
  })

  test('renders url and likes after clicking view', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name:'view' })
    await user.click(button)

    expect(screen.queryByText(blog.url, { exact: false })).toBeInTheDocument()
    expect(screen.queryByText(`likes ${blog.likes}`, { exact: false })).toBeInTheDocument()
  })

  test('clicking like twice calls handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name:'view' })
    await user.click(button)

    const likeButton = screen.getByRole('button', { name:'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(handleLikeBlog.mock.calls).toHaveLength(2)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
})