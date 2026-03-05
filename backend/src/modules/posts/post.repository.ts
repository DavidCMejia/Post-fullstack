import { AppDataSource } from '../../config/dataSource'
import { Post } from '../../entities/Post'

export const PostRepository = AppDataSource.getRepository(Post).extend({
  async findAll(
    page = 1,
    limit = 10
  ): Promise<{ data: Post[]; total: number; page: number; totalPages: number }> {
    const [data, total] = await this.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, totalPages: Math.ceil(total / limit) }
  },

  async findById(id: string): Promise<Post | null> {
    return this.findOne({ where: { id }, relations: ['author'] })
  },

  async createPost(
    data: Pick<Post, 'title' | 'content' | 'authorUserId'>
  ): Promise<Post> {
    const post = this.create(data)
    return this.save(post)
  },

  async updatePost(
    id: string,
    data: Partial<Pick<Post, 'title' | 'content' | 'authorUserId'>>
  ): Promise<Post | null> {
    const post = await this.findById(id)
    if (!post) return null
    this.merge(post, data)
    return this.save(post)
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await this.delete({ id })
    return (result.affected ?? 0) > 0
  },
})
