import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import LoginPage from '../pages/index'
import authReducer from '../slices/authSlice'
import usersReducer from '../slices/usersSlice'
import postsReducer from '../slices/postsSlice'
import api from '../services/api'

// Mock next router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

// Mock API service 
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}))

const mockedApi = api as jest.Mocked<typeof api>

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
  },
})

const renderWithProvider = (component: React.ReactElement) =>
  render(<Provider store={mockStore}>{component}</Provider>)

describe('LoginPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('should render login form with email and password fields', () => {
    renderWithProvider(<LoginPage />)
  })

  it('should show error message on failed login', async () => {
    mockedApi.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    })
  })

  it('should redirect to dashboard on successful login', async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token' },
    })
  })
})
