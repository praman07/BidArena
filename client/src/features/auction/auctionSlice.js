import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // TODO: Add auction state fields
}

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    // TODO: Add auction reducers
  },
})

export const auctionActions = auctionSlice.actions
export default auctionSlice.reducer
