import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // TODO: Add auction room state fields
}

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    // TODO: Add room reducers
  },
})

export const roomActions = roomSlice.actions
export default roomSlice.reducer
