import { createSlice } from '@reduxjs/toolkit'

const initialState = ''//'render here notification...'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNofify(state, action) {
      return action.payload
    },
    // removeNotify(state, action) {
    //   return ''
    // }
  },
})

export const { createNofify } = notificationSlice.actions

export const setNotification = (content, time) => {
  return dispatch => {
    dispatch(createNofify(content))
    setTimeout(() => {
      dispatch(createNofify(''))
    }, time*1000)
  }
}

export default notificationSlice.reducer