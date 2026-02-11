const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => blog.likes < favorite.likes ? favorite : blog, {})
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const blogsOfAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let maxAuthor = Object.keys(blogsOfAuthor)[0]
  for (const author in blogsOfAuthor) {
    if (blogsOfAuthor[author] > blogsOfAuthor[maxAuthor]) {
      maxAuthor = author
    }
  }

  return { author: maxAuthor, blogs: blogsOfAuthor[maxAuthor] }
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const likesOfAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  let maxAuthor = Object.keys(likesOfAuthor)[0]
  for (const author in likesOfAuthor) {
    if (likesOfAuthor[author] > likesOfAuthor[maxAuthor]) {
      maxAuthor = author
    }
  }

  return { author: maxAuthor, likes: likesOfAuthor[maxAuthor] }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}