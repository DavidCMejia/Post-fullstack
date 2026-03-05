import { Router } from 'express'
import { AuthController } from './auth.controller'

const router = Router()
const controller = new AuthController()

router.post('/verify', (req, res) => controller.verify(req, res))

export default router
