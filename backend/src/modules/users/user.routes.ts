import { Router } from 'express'
import { UserController } from './user.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()
const controller = new UserController()

router.use(authMiddleware)

/**
 * @swagger
 * /users/reqres:
 *   get:
 *     summary: List users from ReqRes (paginated)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Paginated list of ReqRes users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 per_page: { type: integer }
 *                 total: { type: integer }
 *                 total_pages: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReqResUser'
 */
router.get('/reqres', (req, res) => controller.getReqResUsers(req, res))

/**
 * @swagger
 * /users/reqres/{id}:
 *   get:
 *     summary: Get a single ReqRes user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ReqRes user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReqResUser'
 *       404:
 *         description: User not found
 */
router.get('/reqres/:id', (req, res) => controller.getReqResUser(req, res))

/**
 * @swagger
 * /users/saved:
 *   get:
 *     summary: List all locally saved users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Array of saved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedUser'
 */
router.get('/saved', (req, res) => controller.getSavedUsers(req, res))

/**
 * @swagger
 * /users/saved/{id}:
 *   get:
 *     summary: Get a single saved user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Saved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedUser'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a saved user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.get('/saved/:id', (req, res) => controller.getSavedUser(req, res))
router.delete('/saved/:id', (req, res) => controller.deleteSavedUser(req, res))

/**
 * @swagger
 * /users/import/{id}:
 *   post:
 *     summary: Import a user from ReqRes and save to local DB
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: User imported and saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedUser'
 *       404:
 *         description: User not found in ReqRes
 */
router.post('/import/:id', (req, res) => controller.importUser(req, res))

export default router
