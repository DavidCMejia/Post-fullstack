import { Request, Response } from 'express'
import { UserService } from './user.service'
import { AppError } from '../../middlewares/error.middleware'

const userService = new UserService()

export class UserController {
  async importUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError(400, 'User ID must be a number')
    const user = await userService.importUser(id)
    res.status(201).json(user)
  }

  async getSavedUsers(_req: Request, res: Response): Promise<void> {
    const users = await userService.getSavedUsers()
    res.status(200).json(users)
  }

  async getSavedUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError(400, 'User ID must be a number')
    const user = await userService.getSavedUser(id)
    res.status(200).json(user)
  }

  async deleteSavedUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError(400, 'User ID must be a number')
    await userService.deleteSavedUser(id)
    res.status(204).send()
  }
}
