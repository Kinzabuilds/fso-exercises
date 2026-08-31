const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const author = Object.keys(counts).reduce((a, b) => {
    return counts[a] > counts[b] ? a : b
  })

  return {
    author: author,
    blogs: counts[author]
  }
}

const mostLikes = (blogs) => {
  const likes = {}

  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })

  const author = Object.keys(likes).reduce((a, b) => {
    return likes[a] >= likes[b] ? a : b
  })

  return {
    author: author,
    likes: likes[author]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}