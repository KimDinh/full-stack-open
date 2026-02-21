const resetDb = async (request) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      username: 'abcde',
      name: 'User 1',
      password: 'abcde'
    }
  })
  await request.post('/api/users', {
    data: {
      username: 'fghij',
      name: 'User 2',
      password: 'fghij'
    }
  })
}

const login = async (page, username, password) => {
  await page.getByRole('textbox', { name: /username/i }).fill(username)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

const addBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByRole('textbox', { name: /title/i }).fill(title)
  await page.getByRole('textbox', { name: /author/i }).fill(author)
  await page.getByRole('textbox', { name: /url/i }).fill(url)
  await page.getByRole('button', { name: /add/i }).click()
  await page.getByText(`${title}, ${author}`).waitFor()
}

const likeBlog = async (button, noOfTimes) => {
  for (let i = 0; i < noOfTimes; i++) {
    await button.click()
    await button.locator('..').getByText(`likes ${i+1}`).waitFor()
  }
}

export { resetDb, login, addBlog, likeBlog }