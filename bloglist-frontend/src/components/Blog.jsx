import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    await updateBlog(blog.id, updatedBlog)
  }

  const deleteBlog = async () => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (confirmDelete) {
      await removeBlog(blog.id)
    }
  }

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showWhenVisible}>
        <p>{blog.url}</p>

        <p>
          likes {blog.likes}
          <button onClick={addLike}>like</button>
        </p>

        <p>{blog.author}</p>

        {currentUser &&
          blog.user &&
          blog.user.username === currentUser.username && (
            <button onClick={deleteBlog}>remove</button>
          )}
      </div>
    </div>
  )
}

export default Blog