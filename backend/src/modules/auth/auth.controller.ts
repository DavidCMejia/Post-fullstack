import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { loginSchema } from './auth.validator'

const authService = new AuthService()

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const input = loginSchema.parse(req.body)
    const result = await authService.login(input)
    res.status(200).json(result)
  }
}
