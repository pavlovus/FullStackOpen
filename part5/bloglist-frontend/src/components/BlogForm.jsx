import { useState } from 'react'

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
        <label>
          title
          <input type="text" className='titleInput' value={newTitle} onChange={({ target }) => setNewTitle (target.value)}/>
        </label>
      </div>
      <div>
        <label>
          author
          <input type="text" className='authorInput' value={newAuthor} onChange={({ target }) => setNewAuthor (target.value)}/>
        </label>
      </div>
      <div>
        <label>
          url
          <input type="text" className='urlInput' value={newUrl} onChange={({ target }) => setNewUrl (target.value)}/>
        </label>
      </div>
      <button type="submit" className='sendButton'>create</button>
    </form>
  )
}

export default BlogForm