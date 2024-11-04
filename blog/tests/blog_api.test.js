const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  
  await User.deleteMany({})
  const userObjects = helper.initialUsers
  const usr1 = await api
    .post('/api/users')
    .send(userObjects[0])
  const usr2 = await api
    .post('/api/users')
    .send(userObjects[1])
})


describe('basic tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert(titles.includes('First class tests'))
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('both usernames are within the returned users', async () => {
    const response = await api.get('/api/users')
    const usernames = response.body.map(r => r.username)
    assert(usernames.includes('root'))
    assert(usernames.includes('mluukkai'))
  })
})

describe('viewing a specific blog', () => {
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

test('token from valid login can be retrieved', async () => {
  const token = await api
    .post('/api/login')
    .send({
      username: "root",
      password: "password"
    })
    .expect(200)
  assert.strictEqual(token.body.username, 'root')
  assert.strictEqual(token.body.name, 'Super User')
})

describe('posting a blog', () => {
  test('a valid blog can be added ', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)

    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(201)
      // .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('Go To Statement Considered Harmful'))
  })

  test('no token blog post returns 401', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('if like is not specified, it is set to 0', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)

    const newBlog = {
      title: 'Hello World',
      author: 'me',
      url: '/',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.filter(n => n.title === newBlog.title)
    assert.strictEqual(titles.length, 1)
    assert.strictEqual(titles[0].likes, 0)
  })
  
  test('blog without url is not added', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)

    const newBlog = {
      title: 'Hello World',
      author: 'me',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
  
  test('blog without title is not added', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)
    const newBlog = {
      author: 'me',
      url: '../..'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)
    
    const newBlog = {
      title: 'Hello World',
      author: 'me',
      url: '/',
    }

    const retBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    await api
      .delete(`/api/blogs/${retBlog.body.id}`)
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(newBlog.title))
  })
  
  test('fails with 401 if no token', async () => {
    const tokens = await api
      .post('/api/login')
      .send({
        username: "root",
        password: "password"
      })
      .expect(200)
    
    const newBlog = {
      title: 'Hello World',
      author: 'me',
      url: '/',
    }

    const retBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokens.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    await api
      .delete(`/api/blogs/${retBlog.body.id}`)
      .expect(401)
  })
  
  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('putting a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {...blogToUpdate, likes: 5000}

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blog = blogsAtEnd.filter(r => r.id === blogToUpdate.id)
    assert(blog[0].likes === 5000)
  })
})

after(async () => {
  await mongoose.connection.close()
})