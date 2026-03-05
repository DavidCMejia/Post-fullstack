import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export const verifySchema = z.object({
  email: z.string().email('Invalid email format'),
  reqresToken: z.string().min(1, 'ReqRes token is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type VerifyInput = z.infer<typeof verifySchema>
