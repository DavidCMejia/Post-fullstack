import axios from 'axios'
import jwt from 'jsonwebtoken'
import { AppError } from '../../middlewares/error.middleware'
import { LoginInput } from './auth.validator'

interface ReqResLoginResponse {
  token: string
}

export class AuthService {
  async login(input: LoginInput): Promise<{ token: string }> {
    try {
      const { data } = await axios.post<ReqResLoginResponse>(
        `${process.env.REQRES_BASE_URL ?? 'https://reqres.in/api'}/login`,
        { email: input.email, password: input.password }
      )

      const ourToken = jwt.sign(
        { email: input.email, reqresToken: data.token },
        process.env.JWT_SECRET ?? 'secret',
        { expiresIn: '24h' }
      )

      return { token: ourToken }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        throw new AppError(401, 'Invalid credentials')
      }
      throw new AppError(502, 'Authentication service unavailable')
    }
  }
}
