const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Robert C. Martin',
    url: 'https://example.com/html',
    likes: 5
  },
  {
    title: 'React is interesting',
    author: 'Robert C. Martin',
    url: 'https://example.com/react',
    likes: 10
  }
]


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()
})


describe('Blog API', () => {

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(0)
  })


  test('a valid blog can be added with token', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Testing blog',
      author: 'Test Author',
      url: 'https://example.com/testing',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(1)
    expect(blogsAtEnd[0].title).toBe('Testing blog')
  })


  test('adding a blog fails with 401 if token is missing', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Test Author',
      url: 'https://example.com/no-token',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(0)
  })


  test('blog can be deleted by its creator', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
      .expect(200)

    const token = loginResponse.body.token

    const createResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Blog to delete',
        author: 'Test Author',
        url: 'https://example.com/delete',
        likes: 5
      })
      .expect(201)

    const blogId = createResponse.body.id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(0)
  })


  test('blog cannot be deleted by another user', async () => {
    // Create second user
    const passwordHash = await bcrypt.hash('password', 10)

    const secondUser = new User({
      username: 'seconduser',
      name: 'Second User',
      passwordHash
    })

    await secondUser.save()


    // Login first user
    const firstLogin = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    const firstToken = firstLogin.body.token


    // First user creates blog
    const createResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        title: 'Protected blog',
        author: 'Test Author',
        url: 'https://example.com/protected',
        likes: 5
      })

    const blogId = createResponse.body.id


    // Login second user
    const secondLogin = await api
      .post('/api/login')
      .send({
        username: 'seconduser',
        password: 'password'
      })

    const secondToken = secondLogin.body.token


    // Second user tries to delete
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${secondToken}`)
      .expect(401)


    // Blog should still exist
    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(1)
  })

})


describe('User API', () => {

  test('a valid user can be created', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const users = await User.find({})

    expect(users).toHaveLength(2)

    const usernames = users.map(user => user.username)

    expect(usernames).toContain('newuser')
  })


  test('user is not created if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Bad User',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBeDefined()

    const users = await User.find({})

    expect(users).toHaveLength(1)
  })


  test('user is not created if password is too short', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Bad User',
      password: 'ab'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBeDefined()

    const users = await User.find({})

    expect(users).toHaveLength(1)
  })


  test('user is not created without username', async () => {
    const newUser = {
      name: 'No Username',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const users = await User.find({})

    expect(users).toHaveLength(1)
  })


  test('user is not created without password', async () => {
    const newUser = {
      username: 'newuser',
      name: 'No Password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const users = await User.find({})

    expect(users).toHaveLength(1)
  })


  test('user is not created with duplicate username', async () => {
    const newUser = {
      username: 'root',
      name: 'Another Root',
      password: 'password'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBeDefined()

    const users = await User.find({})

    expect(users).toHaveLength(1)
  })


  test('password is not returned', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)

    expect(response.body[0].passwordHash).toBeUndefined()
  })

})


afterAll(async () => {
  await mongoose.connection.close()
})