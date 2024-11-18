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

export const { createNofify, removeNotify } = notificationSlice.actions
export default notificationSlice.reducer