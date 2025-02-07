import { useNotiValue } from '../NotiContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useNotiValue()

  if (!notification) {
    return null
  }

  const { message, type } = notification

  return (
    <div>
      {(message &&
        <Alert severity={type}>
          {message}
        </Alert>
      )}
    </div>
  )
}

export default Notification