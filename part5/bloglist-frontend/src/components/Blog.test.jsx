import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'John Doe',
  url: 'https://example.com',
  likes: 0,
  user: {
    id: 'user1',
    nickname: 'johndoe',
    name: 'John Doe'
  }
}

test('renders only blog title and author', () => {
  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const blogTitle = container.querySelector('.blogTitle')
  expect(blogTitle).toHaveTextContent('Component testing is done with react-testing-library')

  const blogAuthor = container.querySelector('.blogAuthor')
  expect(blogAuthor).toHaveTextContent('John Doe')

  const blogUrl = container.querySelector('.blogUrl')
  expect(blogUrl).not.toBeVisible()

  const blogLikes = container.querySelector('.blogLikes')
  expect(blogLikes).not.toBeVisible()

  const blogUser = container.querySelector('.blogUser')
  expect(blogUser).not.toBeVisible()
})

test('renders url, likes and user name after button click', async () => {
  const { container } = render(<Blog blog={blog} user={blog.user} />)
  const user = userEvent.setup()

  const viewButton = container.querySelector('.viewButton')
  await user.click(viewButton)

  const blogUrl = container.querySelector('.blogUrl')
  expect(blogUrl).toBeVisible()
  expect(blogUrl).toHaveTextContent('https://example.com')

  const blogLikes = container.querySelector('.blogLikes')
  expect(blogLikes).toBeVisible()
  expect(blogLikes).toHaveTextContent('0')

  const blogUser = container.querySelector('.blogUser')
  expect(blogUser).toBeVisible()
  expect(blogUser).toHaveTextContent('John Doe')
})

test('clicking the like button twice calls event handler twice', async () => {
  const handleLike = vi.fn()
  const { container } = render(<Blog blog={blog} user={blog.user} handleLike={handleLike} />)
  const user = userEvent.setup()

  const viewButton = container.querySelector('.viewButton')
  await user.click(viewButton)

  const likeButton = container.querySelector('.blogLikeButton')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLike.mock.calls).toHaveLength(2)
})