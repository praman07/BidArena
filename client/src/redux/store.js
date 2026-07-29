import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import auctionReducer from '@/features/auction/auctionSlice'
import roomReducer from '@/features/auction-room/roomSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    auction: auctionReducer,
    room: roomReducer,
  },
})

export default store
