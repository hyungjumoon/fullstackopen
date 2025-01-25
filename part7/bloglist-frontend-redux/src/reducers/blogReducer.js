import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return [...action.payload].sort((a,b) => b.votes - a.votes)
    }
  },
})

export const { appendBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const removeBlog = id => {
  return async dispatch => {
    const object = await blogService.remove(id)
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const vote = id => {
  return async dispatch => {
    const object = await blogService.get(id)
    const updatedObject = { ...object, votes: object.votes+1 }
    await blogService.update(id, updatedObject)
    dispatch(initializeBlogs())
  }
}

export const placeToken = token => {
  blogService.setToken(token)
}

export default blogSlice.reducer