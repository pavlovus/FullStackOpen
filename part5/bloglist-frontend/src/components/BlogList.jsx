import { Link as RouterLink } from 'react-router-dom'
import { Box, Link, List, ListItem, Typography } from '@mui/material'

const BlogList = ({ blogs, user }) => {
  return (
    <>
      <Typography variant='h4' component='h2' gutterBottom style={{ marginTop: '16px' }}>
        blogs
      </Typography>

      {user && (
        <Typography variant='body1' component='span'>
          {user.name} logged in
        </Typography>
      )}

      <List>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <ListItem key={blog.id} disablePadding>
            <Link component={RouterLink} to={`/blogs/${blog.id}`} underline='hover' style={{ marginTop: '8px' }}>
              {blog.title}
            </Link>
          </ListItem>
        )}
      </List>
    </>
  )
}

export default BlogList