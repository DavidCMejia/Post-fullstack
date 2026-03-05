import axios from 'axios'
import { SavedUserRepository } from './savedUser.repository'
import { SavedUser } from '../../entities/SavedUser'
import { AppError } from '../../middlewares/error.middleware'

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

export class UserService {
  async importUser(id: number): Promise<SavedUser> {
    let reqresUser: ReqResUser

    try {
      const { data } = await axios.get<ReqResUserResponse>(`${REQRES_BASE}/users/${id}`)
      reqresUser = data.data
    } catch {
      throw new AppError(404, `User with id ${id} not found in ReqRes`)
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
