const mongoose = require('mongoose')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog({ ...request.body, user: user._id })
  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
  user.blogs = user.blogs.concat(populatedBlog._id)
  await user.save()
  response.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).end()
  }

  Object.assign(blog, { ...request.body, user: new mongoose.Types.ObjectId(request.body.user) })
  const updatedBlog = await blog.save()
  const populatedBlog = await updatedBlog.populate('user', { username: 1, name: 1, id: 1 })
  response.json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: "unauthorized user" })
  }

  await blog.deleteOne()
  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())
  response.status(204).end()
})

module.exports = blogsRouter