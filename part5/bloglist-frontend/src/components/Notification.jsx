import { Alert } from '@mui/material'

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={success ? 'success' : 'error'}>
      {message}
    </Alert>
  )
}

export default Notification