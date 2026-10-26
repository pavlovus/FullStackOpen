import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user }) => {
  return (
    <>
      <h2>blogs</h2>

      {user && <span>{user.name} logged in</span>}

      <ul>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        )}
      </ul>
    </>
  )
}

export default BlogList