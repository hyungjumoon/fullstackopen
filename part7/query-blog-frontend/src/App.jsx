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
import { getBlogs, createBlog, updateBlog, deleteBlog } from './requests'

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

const App = () => {
  // const [blogs, setBlogs] = useState([])
  // const [user, setUser] = useState(null)
  // const [notification, setNotification] = useState(null)
  const [user, loginDispatch] = useReducer(loginReducer, null)
  const dispatch = useNotiDispatch()
  const queryClient = useQueryClient()

  // useEffect(() => {
  //   blogService.getAll().then(blogs =>
  //     setBlogs(blogs)
  //   )
  // }, [])

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
      loginDispatch({ type: 'login', payload: user })
      // setUser(user)
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


  // const notify = (message, type = 'success') => {
  //   setNotification({ message, type })
  //   setTimeout(() => {
  //     setNotification(null)
  //   }, 5000)
  // }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      // setUser(user)
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
      // const anecdotes = queryClient.getQueryData(['anecdotes'])
      // queryClient.setQueryData(['notes'], anecdotes.concat(newAnecdote))
    },
    onError: () => {
      notify('blog creation error', 'error')
    }
  })

  const addBlog = async (blog) => {
    // event.preventDefault()
    // const content = event.target.anecdote.value
    // event.target.anecdote.value = ''
    newBlogMutation.mutate(blog)
    blogFormRef.current.toggleVisibility()
  }

  // const handleCreate = async (blog) => {
  //   const newBlog = await blogService.create(blog)
  //   setBlogs(blogs.concat(newBlog))
  //   notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
  //   blogFormRef.current.toggleVisibility()
  // }

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

  // const handleVote = async (blog) => {
  //   console.log('updating', blog)
  //   const updatedBlog = await blogService.update(blog.id, {
  //     ...blog,
  //     likes: blog.likes + 1
  //   })

  //   notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
  //   setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
  // }

  const handleLogout = () => {
    // setUser(null)
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
      // queryClient.invalidateQueries({ queryKey: ['blogs'] })
      // notify(`Blog ${blog.title}, by ${blog.author} removed`)
    }
  }

  // const handleDelete = async (blog) => {
  //   if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
  //     await blogService.remove(blog.id)
  //     setBlogs(blogs.filter(b => b.id !== blog.id))
  //   }
  // }

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