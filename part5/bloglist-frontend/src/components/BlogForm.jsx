import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({ title: newTitle, author: newAuthor, url: newUrl })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <TextField
          label="title"
          type="text"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          style={{ width: '50%' }}
        />
      </div>
      <div>
        <TextField
          label="author"
          type="text"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          style={{ marginTop: '8px', width: '50%' }}
        />
      </div>
      <div>
        <TextField
          label="url"
          type="text"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          style={{ marginTop: '8px', width: '50%' }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: '16px' }}>create</Button>
    </form>
  )
}

export default BlogForm