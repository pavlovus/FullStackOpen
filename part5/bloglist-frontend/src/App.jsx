import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

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
      navigate('/')

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
      setBlogs(blogs.concat({ ...newBlog, user }))
      navigate('/')
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
      navigate('/')
    } catch (error) {
      setMessage(error.response.data.error)
      setSuccess(false)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const padding = { padding: 5 }

  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  return (
    <div>
      <div>
        <Link style={padding} to="/"> blogs </Link>
        {user === null && (
          <Link style={padding} to="/login"> login </Link>
        )}
        {user !== null && (
          <Link style={padding} to="/create"> new blog </Link>
        )}
        {user !== null && (
          <button onClick={handleLogout}> logout </button>
        )}
      </div>

      <Notification message={message} success={success} />

      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} user={user} handleLike={handleLike} handleRemove={handleRemove} />
        } />
        <Route path="/create" element={
          <BlogForm addBlog={addBlog} />
        } />
        <Route path="/login" element={
          <LoginForm login={handleLogin} />
        } />
      </Routes>
    </div>
  )
}

export default App