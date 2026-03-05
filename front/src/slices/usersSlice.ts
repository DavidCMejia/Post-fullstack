import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { UsersState, ReqResUser, SavedUser } from '../types'
import api from '../services/api'

export const fetchReqResUsers = createAsyncThunk(
  'users/fetchReqRes',
  async (page: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/reqres?page=${page}`)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to fetch users')
    }
  }
)

export const fetchSavedUsers = createAsyncThunk(
  'users/fetchSaved',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/saved')
      return res.data as SavedUser[]
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to fetch saved users')
    }
  }
)

export const importUser = createAsyncThunk(
  'users/import',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/import/${id}`)
      return res.data as SavedUser
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to import user')
    }
  }
)

export const deleteSavedUser = createAsyncThunk(
  'users/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/users/saved/${id}`)
      return id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to delete user')
    }
  }
)

const initialState: UsersState = {
  reqresUsers: [],
  savedUsers: [],
  selectedUser: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  loading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<ReqResUser | null>) => {
      state.selectedUser = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReqResUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchReqResUsers.fulfilled, (state, action) => {
        state.loading = false
        state.reqresUsers = action.payload.data
        state.totalPages = action.payload.total_pages
        state.currentPage = action.payload.page
      })
      .addCase(fetchReqResUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchSavedUsers.fulfilled, (state, action) => {
        state.savedUsers = action.payload
      })
      .addCase(importUser.fulfilled, (state, action) => {
        const exists = state.savedUsers.find((u) => u.id === action.payload.id)
        if (!exists) state.savedUsers.push(action.payload)
      })
      .addCase(deleteSavedUser.fulfilled, (state, action) => {
        state.savedUsers = state.savedUsers.filter((u) => u.id !== action.payload)
      })
  },
})

export const { setSearchQuery, setCurrentPage, setSelectedUser, clearError } = usersSlice.actions
export default usersSlice.reducer
