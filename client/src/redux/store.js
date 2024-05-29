import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/postsSlice'

const store = configureStore({
	reducer: {
		posts: postsReducer,
	},
})

export default store
