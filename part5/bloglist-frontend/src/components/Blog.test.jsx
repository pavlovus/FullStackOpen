import { render } from '@testing-library/react'
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

test('blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
  const { container } = render(<Blog blog={blog} user={null} />)

  const blogTitle = container.querySelector('.blogTitle')
  expect(blogTitle).toBeVisible()
  expect(blogTitle).toHaveTextContent('Component testing is done with react-testing-library')

  const blogAuthor = container.querySelector('.blogAuthor')
  expect(blogAuthor).toBeVisible()
  expect(blogAuthor).toHaveTextContent('John Doe')

  const blogUrl = container.querySelector('.blogUrl')
  expect(blogUrl).toBeVisible()
  expect(blogUrl).toHaveTextContent('https://example.com')

  const blogLikes = container.querySelector('.blogLikes')
  expect(blogLikes).toBeVisible()
  expect(blogLikes).toHaveTextContent('0')

  const blogUser = container.querySelector('.blogUser')
  expect(blogUser).toBeVisible()
  expect(blogUser).toHaveTextContent('John Doe')

  const buttons = container.querySelectorAll('button')
  expect(buttons).toHaveLength(0)

  const likeButton = container.querySelector('.blogLikeButton')
  expect(likeButton).toBeNull()

  const removeButton = container.querySelector('.blogRemoveButton')
  expect(removeButton).toBeNull()
})

test('authenticated users who are not the blog’s creator are shown only the like button', () => {
  const nonCreatorUser = {
    id: 'user2',
    nickname: 'janedoe',
    name: 'Jane Doe'
  }

  const { container } = render(<Blog blog={blog} user={nonCreatorUser} />)

  const likeButton = container.querySelector('.blogLikeButton')
  expect(likeButton).toBeDefined()
  expect(likeButton).toBeVisible()

  const removeButton = container.querySelector('.blogRemoveButton')
  expect(removeButton).toBeNull()

  const buttons = container.querySelectorAll('button')
  expect(buttons).toHaveLength(1)
})

test('the blog’s creator is also shown the delete button', () => {
  const { container } = render(<Blog blog={blog} user={blog.user} />)

  const likeButton = container.querySelector('.blogLikeButton')
  expect(likeButton).toBeDefined()
  expect(likeButton).toBeVisible()

  const removeButton = container.querySelector('.blogRemoveButton')
  expect(removeButton).toBeDefined()
  expect(removeButton).toBeVisible()
  expect(removeButton).toHaveTextContent('remove')

  const buttons = container.querySelectorAll('button')
  expect(buttons).toHaveLength(2)
})