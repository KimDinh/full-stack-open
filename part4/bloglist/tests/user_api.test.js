const { test, describe, after, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('users', () => {
  const newUser = {
    username: "newUser",
    name: "New User",
    password: "abcdef",
  }

  test('a valid user can be added', async () => {
    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
    
    assert.strictEqual(usersAfter.length, usersBefore.length + 1)
    assert(usersAfter.map(user => user.username).includes(newUser.username))
  })

  test('user without username cannot be added', async () => {
    const { username, ...userNoUsername } = newUser
    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(userNoUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length)
  })

  test('user without password cannot be added', async () => {
    const { password, ...userNoPassword } = newUser
    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(userNoPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length)
  })

  test('user with username length < 3 characters cannot be added', async () => {
    const invalidUser = { ...newUser, username: "ab" }
    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length)
  })

  test('user with password length < 3 characters cannot be added', async () => {
    const invalidUser = { ...newUser, password: "ab" }
    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length)
  })

  test('same username cannot be added twice', async () => {
    await api.post('/api/users').send(newUser)

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await helper.usersInDb()

    assert.strictEqual(usersAfter.length, usersBefore.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})