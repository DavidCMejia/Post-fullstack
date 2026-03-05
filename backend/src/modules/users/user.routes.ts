import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()
const controller = new UserController()

router.use(authMiddleware)

// Static routes first — before any /:id to avoid conflicts
router.get('/reqres', (req, res) => controller.getReqResUsers(req, res))
router.get('/reqres/:id', (req, res) => controller.getReqResUser(req, res))
router.get('/saved', (req, res) => controller.getSavedUsers(req, res))
router.get('/saved/:id', (req, res) => controller.getSavedUser(req, res))
router.post('/import/:id', (req, res) => controller.importUser(req, res))
router.delete('/saved/:id', (req, res) => controller.deleteSavedUser(req, res))

export default router
