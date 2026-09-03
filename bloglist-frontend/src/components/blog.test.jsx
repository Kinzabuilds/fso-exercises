import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import Blog from './Blog'

const blog = {
  id: '123',
  title: 'Testing React',
  author: 'Matti Luukkainen',
  url: 'https://fullstackopen.com',
  likes: 5,
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  }
}

test('renders title and author but does not render url or likes by default', () => {
  render(
    <Blog
      blog={blog}
      updateBlog={vi.fn()}
      removeBlog={vi.fn()}
      currentUser={blog.user}
    />
  )

  expect(
    screen.getByText('Testing React Matti Luukkainen')
  ).toBeDefined()

  expect(
    screen.queryByText('https://fullstackopen.com')
  ).toBeNull()

  expect(
    screen.queryByText('likes 5')
  ).toBeNull()
})

test('shows url and likes when view button is clicked', async () => {
  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      updateBlog={vi.fn()}
      removeBlog={vi.fn()}
      currentUser={blog.user}
    />
  )

  await user.click(
    screen.getByRole('button', {
      name: 'view'
    })
  )

  expect(
    screen.getByText('https://fullstackopen.com')
  ).toBeDefined()

  expect(
    screen.getByText('likes 5')
  ).toBeDefined()
})

test('clicking like twice calls update twice', async () => {
  const user = userEvent.setup()

  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      removeBlog={vi.fn()}
      currentUser={blog.user}
    />
  )

  await user.click(
    screen.getByRole('button', {
      name: 'view'
    })
  )

  const likeButton =
    screen.getByRole('button', {
      name: 'like'
    })

  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog).toHaveBeenCalledTimes(2)
})