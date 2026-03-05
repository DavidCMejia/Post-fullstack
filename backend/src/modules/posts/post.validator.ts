import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  authorUserId: z.number().int().positive('Author user ID must be a positive integer'),
})

export const updatePostSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).optional(),
  authorUserId: z.number().int().positive().optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
