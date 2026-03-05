import axios from 'axios'
import { AuthService } from '../../modules/auth/auth.service'
import { AppError } from '../../middlewares/error.middleware'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AuthService', () => {
  const authService = new AuthService()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a JWT token on successful login', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'reqres_token_123' } })

    const result = await authService.login({
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    })

    expect(result).toHaveProperty('token')
    expect(typeof result.token).toBe('string')
    expect(result.token.split('.')).toHaveLength(3)
  })

  it('should throw AppError 401 when ReqRes returns 400', async () => {
    const axiosError = { response: { status: 400 }, isAxiosError: true }
    mockedAxios.post.mockRejectedValueOnce(axiosError)
    jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(true)

    await expect(
      authService.login({ email: 'wrong@email.com', password: 'wrong' })
    ).rejects.toThrow(new AppError(401, 'Invalid credentials'))
  })

  it('should throw AppError 502 when ReqRes is unreachable', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))
    jest.spyOn(axios, 'isAxiosError').mockReturnValueOnce(false)

    await expect(
      authService.login({ email: 'any@email.com', password: 'pass' })
    ).rejects.toThrow(new AppError(502, 'Authentication service unavailable'))
  })
})