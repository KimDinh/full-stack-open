import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const sortByLikes = (blogs) => {
    // return a list of blogs sorted in descending order of likes
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  useEffect(async () => {
    const blogs = await blogService.getAll()
    setBlogs(sortByLikes(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type) => {
    setNotificationMsg({ [type]: message })
    setTimeout(() => setNotificationMsg(null), 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch {
      notify("wrong username or password", "error")
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem("loggedUser")
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blog)
      setBlogs(blogs.concat(returnedBlog))
      notify(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`, "notification")
    } catch (err) {
      notify(err.response.data.error, "error")
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(
        sortByLikes(
          blogs.map(b => (b.id === returnedBlog.id ? returnedBlog : b))
        )
      )
    } catch (err) {
      notify(err.response.data.error, "error")
    }
  }

  if (!user)
  {
    return (
      <div>
        <Notification message={notificationMsg}/>
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMsg}/>

      <div>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog}/>
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLikeBlog={() => likeBlog(blog)} />
      )}
    </div>
  )
}

export default App