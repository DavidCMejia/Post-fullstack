import axios from 'axios'
import { SavedUserRepository } from './savedUser.repository'
import { SavedUser } from '../../entities/SavedUser'
import { AppError } from '../../middlewares/error.middleware'
import { MOCK_REQRES_USERS, getMockUsersPage, getMockUserById } from './users.mock'

interface ReqResUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

interface ReqResUserResponse {
  data: ReqResUser
}

const REQRES_BASE = process.env.REQRES_BASE_URL ?? 'https://reqres.in/api'

const reqresHeaders = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Origin': 'https://reqres.in',
  'Referer': 'https://reqres.in/',
}

export class UserService {
  async getReqResUsers(page = 1) {
    try {
      const { data } = await axios.get(`${REQRES_BASE}/users?page=${page}`, {
        headers: reqresHeaders,
        timeout: 5000,
      })
      return data
    } catch {
      console.warn('⚠️  ReqRes unavailable, using mock users')
      return getMockUsersPage(page)
    }
  }

  async getReqResUser(id: number) {
    try {
      const { data } = await axios.get<ReqResUserResponse>(`${REQRES_BASE}/users/${id}`, {
        headers: reqresHeaders,
        timeout: 5000,
      })
      return data.data
    } catch {
      console.warn(`⚠️  ReqRes unavailable, using mock user for id ${id}`)
      const user = getMockUserById(id)
      if (!user) throw new AppError(404, `User with id ${id} not found`)
      return user
    }
  }

  async importUser(id: number): Promise<SavedUser> {
    let reqresUser: ReqResUser

    try {
      const { data } = await axios.get<ReqResUserResponse>(`${REQRES_BASE}/users/${id}`, {
        headers: reqresHeaders,
        timeout: 5000,
      })
      reqresUser = data.data
    } catch {
      console.warn(`⚠️  ReqRes unavailable, using mock user for import id ${id}`)
      const mock = getMockUserById(id)
      if (!mock) throw new AppError(404, `User with id ${id} not found in ReqRes`)
      reqresUser = mock
    }

    return SavedUserRepository.upsert({
      id: reqresUser.id,
      email: reqresUser.email,
      firstName: reqresUser.first_name,
      lastName: reqresUser.last_name,
      avatar: reqresUser.avatar,
    })
  }

  async getSavedUsers(): Promise<SavedUser[]> {
    return SavedUserRepository.findAllSaved()
  }

  async getSavedUser(id: number): Promise<SavedUser> {
    const user = await SavedUserRepository.findById(id)
    if (!user) throw new AppError(404, `Saved user with id ${id} not found`)
    return user
  }

  async deleteSavedUser(id: number): Promise<void> {
    const deleted = await SavedUserRepository.deleteById(id)
    if (!deleted) throw new AppError(404, `Saved user with id ${id} not found`)
  }
}
