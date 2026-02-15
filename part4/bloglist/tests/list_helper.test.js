const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

describe('list_helper', () => {
  const blogs = testHelper.initialBlogs

  describe('total likes', () => {
    test('of empty list', () => {
      assert.strictEqual(listHelper.totalLikes([]), 0)
    })

    test('when list has only one blog', () => {
      assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7)
    })

    test('when list has many blogs', () => {
      assert.strictEqual(listHelper.totalLikes(blogs), 36)
    })
  })

  describe('favorite blog', () => {
    test('of empty list', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
    })

    test('when list has one blog', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog([blogs[0]]), blogs[0])
    })

    test('when list has many blogs', () => {
      assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
    })
  })

  describe('most blogs', () => {
    test('of empty list', () => {
      assert.strictEqual(listHelper.mostBlogs([]), null)
    })

    test('when list has one blog', () => {
      assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), { author: blogs[0].author, blogs: 1 })
    })

    test('when list has many blogs', () => {
      assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: "Robert C. Martin", blogs: 3 })
    })
  })

  describe('most likes', () => {
    test('of empty list', () => {
      assert.strictEqual(listHelper.mostLikes([]), null)
    })

    test('when list has one blog', () => {
      assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), { author: blogs[0].author, likes: blogs[0].likes })
    })

    test('when list has many blogs', () => {
      assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Edsger W. Dijkstra", likes: 17 })
    })
  })
})