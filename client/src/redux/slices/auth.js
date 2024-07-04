import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
	const { data } = await axios.post('/auth/login', params)
	return data
})

export const fetchRegister = createAsyncThunk(
	'auth/fetchRegister',
	async (params) => {
		const { data } = await axios.post('/auth/register', params)
		return data
	}
)

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
	const { data } = await axios.get('/auth/me')
	return data
})

const initialState = {
	data: null,
	status: 'loading',
}

const handlePending = (state) => {
	state.status = 'loading'
	state.data = null
}

const handleFulfilled = (state, action) => {
	state.status = 'loaded'
	state.data = action.payload
}

const handleRejected = (state) => {
	state.status = 'error'
	state.data = null
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout(state) {
			state.data = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAuth.pending, handlePending)
			.addCase(fetchAuth.fulfilled, handleFulfilled)
			.addCase(fetchAuth.rejected, handleRejected)
			.addCase(fetchAuthMe.pending, handlePending)
			.addCase(fetchAuthMe.fulfilled, handleFulfilled)
			.addCase(fetchAuthMe.rejected, handleRejected)
			.addCase(fetchRegister.pending, handlePending)
			.addCase(fetchRegister.fulfilled, handleFulfilled)
			.addCase(fetchRegister.rejected, handleRejected)
	},
})

export const selectIsAuth = (state) => !!state.auth.data

export const authReducer = authSlice.reducer

export const { logout } = authSlice.actions
