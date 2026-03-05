import { Router } from 'express'
import { PostController } from './post.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()
const controller = new PostController()

router.use(authMiddleware)

router.get('/', (req, res) => controller.getPosts(req, res))
router.get('/:id', (req, res) => controller.getPost(req, res))
router.post('/', (req, res) => controller.createPost(req, res))
router.put('/:id', (req, res) => controller.updatePost(req, res))
router.delete('/:id', (req, res) => controller.deletePost(req, res))

export default router
