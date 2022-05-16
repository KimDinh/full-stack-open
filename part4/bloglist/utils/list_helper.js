const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce(
    (prev, curr) => curr.likes > prev.likes ? curr : prev
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCount = lodash.countBy(blogs, 'author')
  const allAuthors = Object.keys(authorCount)
  const authorOfMostBlogs = allAuthors.reduce(
    (prev, curr) => authorCount[curr] > authorCount[prev] ? curr : prev
  )

  return {
    author: authorOfMostBlogs,
    blogs: authorCount[authorOfMostBlogs]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsGroupedByAuthor = lodash.groupBy(blogs, 'author')
  let likesCount = []
  for (const author in blogsGroupedByAuthor) {
    likesCount = likesCount.concat({
      author: author,
      likes: blogsGroupedByAuthor[author].reduce(
        (sum, blog) => sum + blog.likes,
        0
      )
    })
  }

  return likesCount.reduce(
    (prev, curr) => curr.likes > prev.likes ? curr : prev
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}