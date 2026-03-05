import { PostService } from '../../modules/posts/post.service'
import { PostRepository } from '../../modules/posts/post.repository'
import { AppError } from '../../middlewares/error.middleware'

jest.mock('../../modules/posts/post.repository', () => ({
  PostRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    createPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
  },
}))

describe('PostService', () => {
  const postService = new PostService()

  beforeEach(() => jest.clearAllMocks())

  it('should return paginated posts', async () => {
    const mockResult = {
      data: [{ id: 'uuid-1', title: 'Test', content: 'Content', authorUserId: 1 }],
      total: 1,
      page: 1,
      totalPages: 1,
    }
    ;(PostRepository.findAll as jest.Mock).mockResolvedValueOnce(mockResult)

    const result = await postService.getPosts(1, 10)
    expect(result).toEqual(mockResult)
    expect(PostRepository.findAll).toHaveBeenCalledWith(1, 10)
  })

  it('should throw 404 when post not found', async () => {
    ;(PostRepository.findById as jest.Mock).mockResolvedValueOnce(null)

    await expect(postService.getPost('nonexistent-id')).rejects.toThrow(
      new AppError(404, 'Post with id nonexistent-id not found')
    )
  })

  it('should create a post successfully', async () => {
    const input = { title: 'New Post', content: 'Some content here', authorUserId: 1 }
    const created = { ...input, id: 'new-uuid', createdAt: new Date(), updatedAt: new Date() }
    ;(PostRepository.createPost as jest.Mock).mockResolvedValueOnce(created)

    const result = await postService.createPost(input)
    expect(result).toEqual(created)
  })
})
