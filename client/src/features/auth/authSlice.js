import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // TODO: Add auth state fields
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // TODO: Add auth reducers
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
