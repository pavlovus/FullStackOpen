import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

import './index.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      setUser(user)
      setUsername('')
      setPassword('')

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

  const addBlog = async event => {
    event.preventDefault()
  
    try {
      const newBlog = await blogService.create({ title : newTitle, author: newAuthor, url: newUrl })
      setBlogs(blogs.concat(newBlog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')

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

  if(user == null) {
    return (
      <>
        <Notification message={message} success={success} />
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </>
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} success={success} />

      <span>{user.name} logged in</span>
      <button onClick={handleLogout}> logout </button>

      <BlogForm
        addBlog={addBlog}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newAuthor={newAuthor}
        setNewAuthor={setNewAuthor}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
      />
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App