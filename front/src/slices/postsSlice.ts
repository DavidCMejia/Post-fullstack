import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PostsState, Post } from '../types'
import api from '../services/api'

export const fetchPosts = createAsyncThunk(
  'posts/fetchAll',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts?page=${page}&limit=${limit}`)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to fetch posts')
    }
  }
)

export const fetchPost = createAsyncThunk(
  'posts/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${id}`)
      return res.data as Post
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Post not found')
    }
  }
)

export const createPost = createAsyncThunk(
  'posts/create',
  async (data: { title: string; content: string; authorUserId: number }, { rejectWithValue }) => {
    try {
      const res = await api.post('/posts', data)
      return res.data as Post
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to create post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, data }: { id: string; data: Partial<{ title: string; content: string; authorUserId: number }> }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${id}`, data)
      return res.data as Post
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to update post')
    }
  }
)

export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`)
      return id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to delete post')
    }
  }
)

const initialState: PostsState = {
  posts: [],
  selectedPost: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  loading: false,
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.data
        state.total = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.selectedPost = action.payload
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
        state.total += 1
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id)
        if (idx !== -1) state.posts[idx] = action.payload
        if (state.selectedPost?.id === action.payload.id) state.selectedPost = action.payload
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { setSelectedPost, clearError } = postsSlice.actions
export default postsSlice.reducer
