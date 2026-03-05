import { PostRepository } from './post.repository'
import { Post } from '../../entities/Post'
import { AppError } from '../../middlewares/error.middleware'
import { CreatePostInput, UpdatePostInput } from './post.validator'

export class PostService {
  async getPosts(page: number, limit: number) {
    return PostRepository.findAll(page, limit)
  }

  async getPost(id: string): Promise<Post> {
    const post = await PostRepository.findById(id)
    if (!post) throw new AppError(404, `Post with id ${id} not found`)
    return post
  }

  async createPost(input: CreatePostInput): Promise<Post> {
    return PostRepository.createPost({
      title: input.title,
      content: input.content,
      authorUserId: input.authorUserId,
    })
  }

  async updatePost(id: string, input: UpdatePostInput): Promise<Post> {
    const post = await PostRepository.updatePost(id, input)
    if (!post) throw new AppError(404, `Post with id ${id} not found`)
    return post
  }

  async deletePost(id: string): Promise<void> {
    const deleted = await PostRepository.deletePost(id)
    if (!deleted) throw new AppError(404, `Post with id ${id} not found`)
  }
}
