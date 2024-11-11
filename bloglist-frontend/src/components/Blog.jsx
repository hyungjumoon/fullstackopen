import { useState } from 'react'

const Blog = ({ blog, putLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (event) => {
    event.preventDefault()
    putLike({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes+1,
      user: blog.user.id,
      path: blog.id
    })
  }

  const removeButton = () => {
    if (removeBlog) {
      const deleteBlog = (event) => {
        event.preventDefault()
        const certainty = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
        if(certainty) {
          removeBlog(blog.id)
        }
      }
      return (<button onClick={deleteBlog}>remove</button>)
    }
    return null
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br />
        {blog.url} <br />
        {blog.likes} <button onClick={addLike}>like</button> <br />
        {blog.user ? blog.user.name : 'no user, malformed blog object'} <br />
        {removeButton()}
      </div>
    </div>
  )
}

export default Blog