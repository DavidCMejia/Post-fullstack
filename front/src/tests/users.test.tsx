import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import UsersPage from '../pages/users/index'
import authReducer from '../slices/authSlice'
import usersReducer from '../slices/usersSlice'
import postsReducer from '../slices/postsSlice'
import api from '../services/api'

jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('../services/api')
const mockedApi = api as jest.Mocked<typeof api>

const mockUsers = [
  { id: 1, email: 'george.bluth@reqres.in', first_name: 'George', last_name: 'Bluth', avatar: '' },
  { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver', avatar: '' },
]

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
  },
})

const renderWithProvider = (component: React.ReactElement) =>
  render(<Provider store={mockStore}>{component}</Provider>)

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), pathname: '/users' })

    mockedApi.get.mockImplementation((url: string) => {
      if (url.includes('/users/reqres')) {
        return Promise.resolve({
          data: { data: mockUsers, page: 1, total_pages: 1 },
        })
      }
      if (url.includes('/users/saved')) {
        return Promise.resolve({ data: [] })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  it('should render users list', async () => {
    renderWithProvider(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText('George Bluth')).toBeInTheDocument()
      expect(screen.getByText('Janet Weaver')).toBeInTheDocument()
    })
  })

  it('should filter users by search query', async () => {
    renderWithProvider(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText('George Bluth')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Search by name or email...'), {
      target: { value: 'janet' },
    })

    await waitFor(() => {
      expect(screen.queryByText('George Bluth')).not.toBeInTheDocument()
      expect(screen.getByText('Janet Weaver')).toBeInTheDocument()
    })
  })
})
