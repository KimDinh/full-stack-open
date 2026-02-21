import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm/>', () => {
  test('calls handler with correct data', async () => {
    const user = userEvent.setup()
    const addBlog = vi.fn()

    render(<BlogForm addBlog={addBlog} />)

    const title = screen.getByRole('textbox', { name: /title/i })
    const url = screen.getByRole('textbox', { name: /url/i })
    const author = screen.getByRole('textbox', { name: /author/i })
    const button = screen.getByRole('button', { name: /add/i })

    await user.type(title, 'Test blog')
    await user.type(url, 'http://testblog.com')
    await user.type(author, 'Tester')
    await user.click(button)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toEqual({
      title: 'Test blog',
      url: 'http://testblog.com',
      author: 'Tester'
    })
  })
})