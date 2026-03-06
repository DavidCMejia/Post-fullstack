import 'reflect-metadata'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'

import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/user.routes'
import postRoutes from './modules/posts/post.routes'
import { errorHandler } from './middlewares/error.middleware'
import { swaggerSpec } from './config/swagger'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Swagger UI — available at http://localhost:4000/api-docs
// @ts-ignore
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use(errorHandler)

export default app
