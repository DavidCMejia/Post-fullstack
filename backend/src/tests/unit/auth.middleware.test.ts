import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthRequest } from '../../middlewares/auth.middleware'

describe('authMiddleware', () => {
  const mockNext = jest.fn()
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response

  beforeEach(() => jest.clearAllMocks())

  it('should call next() with valid token', () => {
    const token = jwt.sign({ email: 'test@test.com', reqresToken: 'abc' }, 'test_secret')
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest

    authMiddleware(req, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(req.user).toMatchObject({ email: 'test@test.com' })
  })

  it('should return 401 when no token provided', () => {
    const req = { headers: {} } as AuthRequest

    authMiddleware(req, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled() // test
  })

  it('should return 401 when token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } } as AuthRequest

    authMiddleware(req, mockRes, mockNext)

    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockNext).not.toHaveBeenCalled()
  })
})
