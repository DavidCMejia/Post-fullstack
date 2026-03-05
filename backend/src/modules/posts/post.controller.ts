import { Request, Response } from 'express'
import { PostService } from './post.service'
import { createPostSchema, updatePostSchema } from './post.validator'
import { AppError } from '../../middlewares/error.middleware'

const postService = new PostService()

export class PostController {
  async getPosts(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    if (page < 1 || limit < 1) throw new AppError(400, 'Page and limit must be positive')
    const result = await postService.getPosts(page, limit)
    res.status(200).json(result)
  }

  async getPost(req: Request, res: Response): Promise<void> {
    const post = await postService.getPost(req.params.id)
    res.status(200).json(post)
  }

  async createPost(req: Request, res: Response): Promise<void> {
    const input = createPostSchema.parse(req.body)
    const post = await postService.createPost(input)
    res.status(201).json(post)
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    const input = updatePostSchema.parse(req.body)
    const post = await postService.updatePost(req.params.id, input)
    res.status(200).json(post)
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    await postService.deletePost(req.params.id)
    res.status(204).send()
  }
}
