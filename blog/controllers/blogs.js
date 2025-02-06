const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blogsRouter) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
    comments : []
  })
  const savedBlog = await blog.save()
  savedBlog.populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (user.id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'user invalid' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  //delete in users?
  user.blogs = user.blogs.filter(blogId => blogId !== request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
    comments: body.comments
  })
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter