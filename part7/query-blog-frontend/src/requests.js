import axios from 'axios'

import storage from './services/storage'

const baseUrl = '/api/blogs'

export const getConfit = () => ({
  headers : { Authorization: `Bearer ${storage.loadUser().token}` }
})

export const getBlogs = () =>
  axios.get(baseUrl).then(res => res.data)

export const createBlog = newBlog =>
  axios.post(baseUrl, newBlog, getConfit()).then(res => res.data)

export const updateBlog = updatedBlog =>
  axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, getConfit()).then(res => res.data)

export const deleteBlog = async (id) => {
  axios.delete(`${baseUrl}/${id}`, getConfit()).then(res => res.data)
}