const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {  return null }

  return (
    <div>
      <div>
        <h1 className='blogTitle'>{blog.title}</h1>
        <div className='blogAuthor'>{blog.author}</div>
      </div>
      <a href={blog.url} className='blogUrl'>{blog.url}</a>
      <div>
        <span className='blogLikes'> likes {blog.likes} </span>
        {user !== null && (
          <button onClick={() => handleLike(blog)} className='blogLikeButton'> like </button>
        )}
      </div>
      <div className='blogUser'> Added by {blog.user.name} </div>
      {user !== null && user.id === blog.user.id && (
        <div>
          <button onClick={() => window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`) && handleRemove(blog)} className='blogRemoveButton'>
            remove
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog