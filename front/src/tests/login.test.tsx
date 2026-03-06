import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import axios from 'axios'
import LoginPage from '../pages/index'
import authReducer from '../slices/authSlice'
import usersReducer from '../slices/usersSlice'
import postsReducer from '../slices/postsSlice'

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}))

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

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
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('should render login form with email and password fields', () => {
    renderWithProvider(<LoginPage />)

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('eve.holt@reqres.in')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('cityslicka')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should show error message on failed login', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    })

    renderWithProvider(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('eve.holt@reqres.in'), {
      target: { value: 'wrong@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('cityslicka'), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('should redirect to dashboard on successful login', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { token: 'fake-jwt-token' },
    })

    renderWithProvider(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('eve.holt@reqres.in'), {
      target: { value: 'eve.holt@reqres.in' },
    })
    fireEvent.change(screen.getByPlaceholderText('cityslicka'), {
      target: { value: 'cityslicka' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })
})
