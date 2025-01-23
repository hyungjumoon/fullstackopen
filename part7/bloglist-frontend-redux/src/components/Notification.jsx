import { useSelector } from 'react-redux'

const Notification = () => {
  const noti = useSelector(({ notification }) => notification)
  if (noti === '') {
    return null //<div></div>
  }

  return (
    <div className="error">
      {noti}
    </div>
  )
}

export default Notification