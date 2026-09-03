import { useEffect, useState } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/blogform'
import LoginForm from './components/loginform'
import Notification from './components/notification'
import Togglable from './components/togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [message, setMessage] = useState('')
  const [notificationType, setNotificationType] =
    useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort(
        (a, b) => b.likes - a.likes
      )

      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = (text, type = 'success') => {
    setMessage(text)
    setNotificationType(type)

    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleLogin = async credentials => {
    try {
      const loggedUser =
        await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)

      setUser(loggedUser)

      showNotification(
        `Welcome ${loggedUser.name}`
      )
    } catch (error) {
      showNotification(
        'Wrong username or password',
        'error'
      )
    }
  }

  const logout = () => {
    window.localStorage.removeItem(
      'loggedBlogappUser'
    )

    setUser(null)
  }

  const createBlog = async newBlog => {
    try {
      const returnedBlog =
        await blogService.create(newBlog)

      const newBlogs =
        blogs.concat(returnedBlog)

      newBlogs.sort(
        (a, b) => b.likes - a.likes
      )

      setBlogs(newBlogs)

      showNotification(
        `a new blog ${returnedBlog.title} added`
      )

      return returnedBlog
    } catch (error) {
      showNotification(
        'Creating blog failed',
        'error'
      )
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog =
        await blogService.update(
          id,
          updatedBlog
        )

      const newBlogs = blogs.map(blog =>
        blog.id === id
          ? returnedBlog
          : blog
      )

      newBlogs.sort(
        (a, b) => b.likes - a.likes
      )

      setBlogs(newBlogs)

      return returnedBlog
    } catch (error) {
      showNotification(
        'Updating blog failed',
        'error'
      )
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)

      setBlogs(
        blogs.filter(blog => blog.id !== id)
      )

      showNotification(
        'blog removed'
      )
    } catch (error) {
      showNotification(
        'Deleting blog failed',
        'error'
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <h1>Bloglist</h1>

        <Notification
          message={message}
          type={notificationType}
        />

        <h2>Log in to application</h2>

        <LoginForm
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h1>Bloglist</h1>

      <Notification
        message={message}
        type={notificationType}
      />

      <p>
        {user.name} logged in

        <button onClick={logout}>
          logout
        </button>
      </p>

      <Togglable buttonLabel="create new blog">
        <h2>create new</h2>

        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>

      <h2>blogs</h2>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          currentUser={user}
        />
      ))}
    </div>
  )
}

export default App