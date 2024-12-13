import { useNotiValue } from '../NotiContext'

const Notification = () => {
  const noti = useNotiValue()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (noti === '') return <div></div>

  return (
    <div style={style}>
      {noti}
    </div>
  )
}

export default Notification
