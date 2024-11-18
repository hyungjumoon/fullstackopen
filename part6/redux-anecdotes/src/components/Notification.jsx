import { useSelector } from 'react-redux'

const Notification = () => {
  const noti = useSelector(({ notification }) => notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  if (noti !== '') {
    return (
      <div style={style}>
        {noti}
      </div>
    )
  } 
  return <div></div>
}

export default Notification