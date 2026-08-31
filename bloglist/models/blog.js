const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const middleware = require('../middleware/middleware')


// GET ALL BLOGS
// No token required
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(blogs)
})


// GET ONE BLOG
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', {
        username: 1,
        name: 1
      })

    if (!blog) {
      return response.status(404).end()
    }

    response.json(blog)
  } catch (error) {
    next(error)
  }
})


// CREATE BLOG
// Token required
blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {

    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.status(201).json(populatedBlog)
  }
)


// UPDATE BLOG
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!updatedBlog) {
      return response.status(404).end()
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})


// DELETE BLOG
// Token required
// Only creator can delete
blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    // Check ownership
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({
        error: 'only the creator can delete the blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    // Remove blog from user's blogs array
    user.blogs = user.blogs.filter(
      blogId => blogId.toString() !== blog._id.toString()
    )

    await user.save()

    response.status(204).end()
  }
)


// Error handler
blogsRouter.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
})


module.exports = blogsRouter