import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { verifySchema } from './auth.validator'

const authService = new AuthService()

export class AuthController {
  async verify(req: Request, res: Response): Promise<void> {
    const input = verifySchema.parse(req.body)
    const result = await authService.verify(input)
    res.status(200).json(result)
  }
}
