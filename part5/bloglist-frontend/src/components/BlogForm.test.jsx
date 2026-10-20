import { render } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm addBlog={addBlog} />)

  const titleInput = container.querySelector('.titleInput')
  const authorInput = container.querySelector('.authorInput')
  const urlInput = container.querySelector('.urlInput')
  const sendButton = container.querySelector('.sendButton')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(addBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(addBlog.mock.calls[0][0].url).toBe('https://example.com')
})