import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => { setVisible(!visible) }

  return (
    <div style={blogStyle}>
      <div> {blog.title} {blog.author} </div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}> view </button>
      </div>
      <div style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a>
        <div>
          <span> likes {blog.likes} </span>
          <button onClick={() => handleLike(blog)}> like </button>
        </div>
        <div> {blog.user.name} </div>
        {blog.user.id === user.id && (
          <button onClick={() => window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`) && handleRemove(blog)}> remove </button>
        )}
        <div>
          <button onClick={toggleVisibility}> hide </button>
        </div>
      </div>
    </div>
  )
}

export default Blog