import jwt from 'jsonwebtoken'
import { AppError } from '../../middlewares/error.middleware'
import { LoginInput } from './auth.validator'

export class AuthService {
  async verify(input: { email: string; reqresToken: string }): Promise<{ token: string }> {
    if (!input.reqresToken) {
      throw new AppError(400, 'ReqRes token is required')
    }

    const ourToken = jwt.sign(
      { email: input.email, reqresToken: input.reqresToken },
      process.env.JWT_SECRET ?? 'secret',
      { expiresIn: '24h' }
    )

    return { token: ourToken }
  }
}
