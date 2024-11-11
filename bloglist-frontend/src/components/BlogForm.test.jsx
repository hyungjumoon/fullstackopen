import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')
  await user.type(inputs[0], 'blogTitle')
  await user.type(inputs[1], 'blogAuthor')
  await user.type(inputs[2], 'blogUrl')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('blogTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('blogAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('blogUrl')
})