import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <h2>Please, log in to continue</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            style={{ marginTop: '8px' }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: '16px' }}>login</Button>
      </form>
    </>
  )
}

export default LoginForm