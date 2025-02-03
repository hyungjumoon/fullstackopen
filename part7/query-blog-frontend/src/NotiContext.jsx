import { createContext, useReducer, useContext } from 'react'

const notiReducer = (state, action) => {
  switch (action.type) {
  case 'success':
    return { type:action.type, message:action.payload }
  case 'error':
    return { type:action.type, message:action.payload }
  case 'clear':
    return null
  default:
    return null
  }
}

const NotiContext = createContext()

export const NotiContextProvider = (props) => {
  const [noti, notiDispatch] = useReducer(notiReducer, null)

  return (
    <NotiContext.Provider value={[noti, notiDispatch] }>
      {props.children}
    </NotiContext.Provider>
  )
}

export const useNotiValue = () => {
  const notiAndDispatch = useContext(NotiContext)
  return notiAndDispatch[0]
}

export const useNotiDispatch = () => {
  const notiAndDispatch = useContext(NotiContext)
  return notiAndDispatch[1]
}

export default NotiContext