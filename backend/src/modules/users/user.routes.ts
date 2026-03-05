import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()
const controller = new UserController()

router.use(authMiddleware)

router.post('/import/:id', (req, res) => controller.importUser(req, res))
router.get('/saved', (req, res) => controller.getSavedUsers(req, res))
router.get('/saved/:id', (req, res) => controller.getSavedUser(req, res))
router.delete('/saved/:id', (req, res) => controller.deleteSavedUser(req, res))

export default router
