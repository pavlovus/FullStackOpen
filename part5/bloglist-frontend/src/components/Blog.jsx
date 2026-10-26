import { Box, Button, Link, Stack, Typography } from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {  return null }

  return (
    <Box style={{ marginTop: '16px' }}>
      <Box>
        <Typography variant='h4' component='h1'>
          {blog.title}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary'>
          {blog.author}
        </Typography>
      </Box>

      <Link href={blog.url} style={{ marginTop: '8px' }}>
        {blog.url}
      </Link>

      <Typography variant='body2' style={{ marginTop: '8px' }}>
        by {blog.user.name}
      </Typography>

      <Stack direction='row' spacing={1} alignItems='center' style={{ marginTop: '8px' }}>
        <Typography component='span'>
          likes {blog.likes}
        </Typography>
        {user !== null && (
          <Button
            variant='outlined'
            size='small'
            onClick={() => handleLike(blog)}
          >
            like
          </Button>
        )}
        {user !== null && user.id === blog.user.id && (
          <Button
            variant='outlined'
            color='error'
            size='small'
            onClick={() =>
              window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`) &&
              handleRemove(blog)
            }
          >
            remove
          </Button>
        )}
      </Stack>
    </Box>
  )
}

export default Blog