import { Router } from 'express'
import { AuthController } from './auth.controller'

const router = Router()
const controller = new AuthController()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Validates credentials against ReqRes API (with local fallback) and returns a signed JWT.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: ReqRes service unavailable
 */
router.post('/login', (req, res) => controller.login(req, res))

export default router
