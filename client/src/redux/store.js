import { configureStore } from '@reduxjs/toolkit'
import auctionReducer from '@/features/auction/auctionSlice'
import roomReducer from '@/features/auction-room/roomSlice'

const store = configureStore({
  reducer: {
    auction: auctionReducer,
    room: roomReducer,
  },
})

export default store
