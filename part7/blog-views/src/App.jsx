import { useState, useEffect, createRef, useReducer } from 'react'

// import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Header from './components/Header'

import { useNotiDispatch } from './NotiContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, deleteBlog, getUsers } from './requests'

import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
} from 'react-router-dom'

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from '@mui/material'

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
  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                User
              </TableCell>
              <TableCell>
                blogs created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

const User = ({ users, blogs }) => {
  const id = useParams().id
  const user = users.find(a => a.id === id)
  const userBlogs = blogs.filter(b => b.user.id === id)
  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <b>added blogs</b>
      <ul>
        {userBlogs.map(blog =>
          <li key={blog.id} >
            <div>{blog.title} </div>
          </li>
        )}
      </ul>
    </div>
  )
}

const BlogView = ({ blogs, handleVote, handlePut }) => {
  const id = useParams().id
  const blog = blogs.find(a => a.id === id)
  const nameOfUser = blog.user ? blog.user.name : 'anonymous'
  const [newCom, setNewCom] = useState('')

  const handleNewComChange = (event) => {
    setNewCom(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handlePut(blog, newCom)
    setNewCom('')
  }

  if (!blog) {
    return null
  }
  const Comments = () => {
    if (!blog.comments) {
      return null
    }
    return (
      <ul>
        {blog.comments.map(com =>
          <li key={blog.id + com}>{com}</li>
        )}
      </ul>
    )
  }
  return (
    <div>
      <h1>{blog.title} by {blog.author}</h1>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes} likes
        <button
          style={{ marginLeft: 3 }}
          onClick={() => handleVote(blog)}
        >
          like
        </button>
      </div>
      <div>added by {nameOfUser}</div>
      <h2>comments</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            data-testid='newCom'
            value={newCom}
            onChange={handleNewComChange}
          />
        </div>
        <button type="submit">add comment</button>
      </form>
      <Comments />
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
      dispatch({ type: '', payload: null })
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

  const handleComment = (blog, com) => {
    //   console.log('updating', blog)
    updateBlogMutation.mutate({ ...blog, likes: blog.likes+1, comments: blog.comments.concat([com]) })
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

  const result2 = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
    // retry: 1
  })


  if ( result.isLoading || result2.isLoading ) {
    return <div>loading data...</div>
  }
  if ( result.isError || result2.isError ) {
    return <div>blog service is not available due to problems in server</div>
  }
  // console.log(result.data)
  const blogs = result.data
  const usersData = result2.data

  const byLikes = (a, b) => b.likes - a.likes

  const oldBlogs = (
    blogs.sort(byLikes).map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        handleVote={handleVote}
        handleDelete={handleDelete}
      />
    )
  )

  const blogList = (
    <div>
      <h2>blogs</h2>
      <div>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <NewBlog doCreate={addBlog} />
        </Togglable>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Blog
              </TableCell>
              <TableCell>
                Author
              </TableCell>
              <TableCell>
                Likes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.author}
                </TableCell>
                <TableCell>
                  {blog.likes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    )
  }

  return (
    <Container>
      <Router>
        <Header user={user} logout={handleLogout} />
        <Notification />
        <Routes>
          <Route path="/users/:id" element={<User users={usersData} blogs={blogs} />} />
          <Route path="/users" element={<UserList users={usersData} />} />
          <Route path="/" element={blogList} />
          <Route path="/blogs/:id" element={<BlogView blogs={blogs} handleVote={handleVote} handlePut={handleComment} />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App