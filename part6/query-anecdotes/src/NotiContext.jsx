import { createContext, useReducer, useContext } from 'react'

const notiReducer = (state, action) => {
  switch (action.type) {
    case "VOTE":
      return `anecdote '${action.payload}' voted`
    case "CREATE":
      return `anecdote '${action.payload}' created`
    case "ERROR":
      return 'too short anecdote, must have length 5 or more'
    case "CLEAR":
      return ''
    default:
      return state
  }
}

const NotiContext = createContext()

export const NotiContextProvider = (props) => {
  const [noti, notiDispatch] = useReducer(notiReducer, "")

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