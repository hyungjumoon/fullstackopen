import { useState, useEffect, createRef, useReducer } from 'react'

// import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { useNotiDispatch } from './NotiContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, deleteBlog, getUsers } from './requests'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate
} from 'react-router-dom'

const loginReducer = (state, action) => {
  switch (action.type) {
  case 'login':
    return action.payload
  case 'logout':
    return null
  default:
    return state
  }
}

const UserList = ({ users }) => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    // retry: 1
  })

  if ( result.isLoading ) {
    return <div>loading user data...</div>
  }
  if ( result.isError ) {
    return <div>user service is not available due to problems in server</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <b>blogs created</b>
      <ul>
        {users.map(user =>
          <li key={user.id} >
            <div>{user.name} {user.blogs.length} </div>
            {/* <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link> */}
          </li>
        )}
      </ul>
    </div>
  )
}

const App = () => {
  const [user, loginDispatch] = useReducer(loginReducer, null)
  const dispatch = useNotiDispatch()
  const queryClient = useQueryClient()

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      loginDispatch({ type: 'login', payload: user })
    }
  }, [])

  const blogFormRef = createRef()

  const notify = (content, type = 'success') => {
    dispatch({ type: type, payload: content })
    setTimeout(() => {
      dispatch({ type: 'clear', payload: null })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
    // retry: 1
  })

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      loginDispatch({ type: 'login', payload: user })
      storage.saveUser(user)
      notify(`Welcome back, ${user.name}`)
    } catch (error) {
      notify('Wrong credentials', 'error')
    }
  }

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
    },
    onError: () => {
      notify('blog creation error', 'error')
    }
  })

  const addBlog = async (blog) => {
    newBlogMutation.mutate(blog)
    blogFormRef.current.toggleVisibility()
  }

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
    },
    onError: () => {
      notify('blog vote error', 'error')
    }
  })

  const handleVote = (blog) => {
    //   console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes+1 })
  }

  const handleLogout = () => {
    loginDispatch({ type: 'logout' })
    storage.removeUser()
    notify(`Bye, ${user.name}!`)
  }

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notify('Blog removed')
    },
    onError: () => {
      notify('Blog delete error', 'error')
    }
  })

  const handleDelete = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
    //   console.log('updating', blog)
      deleteBlogMutation.mutate(blog.id)
    }
  }

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  if ( result.isError ) {
    return <div>blog service is not available due to problems in server</div>
  }
  // console.log(result.data)
  const blogs = result.data

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  const byLikes = (a, b) => b.likes - a.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={addBlog} />
      </Togglable>
      {blogs.sort(byLikes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App