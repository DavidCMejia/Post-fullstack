import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '../types'

const initialState: AuthState = {
  token: null,
  email: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.token = null
      state.email = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
