const express = require('express')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./middleware/middleware')

const app = express()

app.use(express.json())

// Extract token from Authorization header
app.use(middleware.tokenExtractor)


// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


// Unknown endpoint
app.use((request, response) => {
  response.status(404).json({
    error: 'unknown endpoint'
  })
})


// Error handler
app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
})


module.exports = app