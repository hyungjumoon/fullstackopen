import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin =  async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addLike = (blogObject) => {
    blogService
      .update(blogObject)
      .then(returnedBlog => {
        const updatedBlogs = blogs.filter(blog => blog.id !== returnedBlog.id)
        setBlogs(updatedBlogs.concat(returnedBlog))
        setErrorMessage(`a like has been added to the blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (id) => {
    blogService.remove(id).then(returnedBlog => {
      setBlogs(blogs.filter(blog => blog.id !== id))
      setErrorMessage(`the blog with id ${id} has been deleted`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const myBlogs = () => {
    const blogIds = blogs.filter(testBlog => testBlog.user && testBlog.user.username === user.username).map(blog => blog.id)
    const helper = (curBlog) => {
      if (blogIds.includes(curBlog.id)) {
        return <Blog key={curBlog.id} blog={curBlog} putLike={addLike} removeBlog={removeBlog} />
      }
      return <Blog key={curBlog.id} blog={curBlog} putLike={addLike} removeBlog={null} />
    }
    return (
      blogs.map(helper)
    )
  }

  if (user !== null) {
    blogs.sort((a,b) => b.likes - a.likes)
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={errorMessage} />
        <div>{user.name} logged in <button onClick={logout}>logout</button></div>
        {blogForm()}
        {myBlogs()}
      </div>
    )
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} />
      {loginForm()}
    </div>
  )
}

export default App