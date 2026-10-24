import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs( blogs )
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async userObject => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      setUser(user)
      blogService.setToken(user.token)

      setMessage('login successful')
      setSuccess(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setMessage('wrong username or password')
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)

    setMessage('logout successful')
    setSuccess(true)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = async blog => {
    try {
      const newBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat({ ...newBlog, user }))
      setMessage(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
      setSuccess(true)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage(error.response.data.error)
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLike = async blogToLike => {
    try {
      const updatedBlog = await blogService.likeBlog(blogToLike)
      setBlogs(blogs.map(b => b.id === updatedBlog.id ? { ... updatedBlog, user: blogToLike.user } : b))
    } catch (error) {
      setMessage(error.response.data.error)
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async blogToRemove => {
    try {
      await blogService.remove(blogToRemove)
      setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
    } catch (error) {
      setMessage(error.response.data.error)
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if(user === null) {
    return (
      <>
        <Notification message={message} success={success} />
        <LoginForm login={handleLogin} />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} success={success} />

      <span>{user.name} logged in</span>
      <button onClick={handleLogout}> logout </button>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      <br />
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleRemove={handleRemove} />
      )}
    </div>
  )
}

export default App