import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'

import BlogForm from './BlogForm'

test('calls createBlog with correct details', async () => {
  const user = userEvent.setup()

  const createBlog = vi.fn()

  render(
    <BlogForm createBlog={createBlog} />
  )

  const inputs =
    screen.getAllByRole('textbox')

  await user.type(
    inputs[0],
    'New blog'
  )

  await user.type(
    inputs[1],
    'New author'
  )

  await user.type(
    inputs[2],
    'https://example.com'
  )

  await user.click(
    screen.getByRole('button', {
      name: 'create'
    })
  )

  expect(createBlog).toHaveBeenCalledWith({
    title: 'New blog',
    author: 'New author',
    url: 'https://example.com',
    likes: 0
  })
})