import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'hello there',
    author: 'Obi-wan Kenobi',
    url: 'r/prequelmemes',
    user: {
      id: '97648512316497856'
    }
  }

  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} putLike={mockHandler}/>
    ).container
  })

  // test('renders its children', async () => {
  //   await screen.findAllByText('hello there')
  // })

  test('at start blog title and author are visible', () => {
    const div = container.querySelector('.togglableLike')
    expect(div).not.toHaveStyle('display: none')
  })

  test('at start blog url and likes are not visible', () => {
    const div = container.querySelector('.togglableLikeContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, blog url and likes are visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableLikeContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the button twice also calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})