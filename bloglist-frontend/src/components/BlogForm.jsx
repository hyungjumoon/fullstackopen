import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        title: <input
          data-testid='title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        /><br />
        author: <input
          data-testid='author'
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        /><br />
        url: <input
          data-testid='url'
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        /><br />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm