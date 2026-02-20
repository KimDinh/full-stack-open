const { test, describe, after, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const testUser = {
  username: "abcde",
  user: "User 1",
  password: "abcde",
}

let token
let userId

before(async () => {
  await User.deleteMany({})
  userId = (await api.post('/api/users').send(testUser)).body.id
  token = (await api.post('/api/login').send(testUser)).body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs.map(blog => ({ ...blog, user: userId })))
})

describe('when there are some initial blogs saved', () => {
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

  test('blog has attribute id', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(blog => assert('id' in blog, "Blog is missing id attribute"))
  })

  describe('viewing a specific blog', () => {
    test('succeeds with valid id', async () => {
      const blogToView = (await helper.blogsInDb())[0]
      const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      assert.deepStrictEqual(response.body, { ...blogToView, user: blogToView.user.toString() })
    })

    test('fails with status code 404 if id does not exist', async () => {
      const nonExistingId = await helper.nonExistingId()
      await api.get(`/api/blogs/${nonExistingId}`).expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = "12345abcde"
      await api.get(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe("adding a new blog", () => {
    const newBlog = {
      title: "Added Blog",
      author: "Abc Def",
      url: "https://addedBlog.com",
      likes: "3"
    }

    test('blog count increases by 1 and added blog title is found', async () => {
      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}`})
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
      assert(blogsAfter.map(blog => blog.title).includes(newBlog.title))
    })

    test('likes default to 0 if not given', async () => {
      const { likes, ...blogNoLikes } = newBlog
      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}`})
        .send(blogNoLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.find(blog => blog.title === newBlog.title).likes, 0)
    })

    test('adding a blog without title results in status code 400', async () => {
      const { title, ...blogNoTitle } = newBlog
      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}`})
        .send(blogNoTitle)
        .expect(400)
    })

    test('adding a blog without url results in status code 400', async () => {
      const { url, ...blogNoUrl } = newBlog
      await api
        .post("/api/blogs")
        .set({ Authorization: `Bearer ${token}`})
        .send(blogNoUrl)
        .expect(400)
    })

    test('adding a blog without valid token results in status code 401', async () => {
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('deleting a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsBefore = await helper.blogsInDb()
      const blogToDelete = blogsBefore[0]
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)
      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, blogsBefore.length - 1)
      assert(!blogsAfter.map(blog => blog.title).includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('all fields will be updated', async () => {
      const blogToUpdate = (await helper.blogsInDb())[0]

      const editedBlog = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'https://updated_url.com',
        likes: blogToUpdate.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(editedBlog)
        .expect(200)

      const updatedBlog = await Blog.findById(blogToUpdate.id)

      for (prop in ["title", "author", "url", "likes"]) {
        assert.strictEqual(updatedBlog[prop], editedBlog[prop])
      }
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})