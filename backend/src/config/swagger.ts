import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users & Posts API',
      version: '1.0.0',
      description: 'REST API for the Fullstack Challenge — Express + TypeScript + PostgreSQL',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'eve.holt@reqres.in' },
            password: { type: 'string', example: 'cityslicka' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        ReqResUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'george.bluth@reqres.in' },
            first_name: { type: 'string', example: 'George' },
            last_name: { type: 'string', example: 'Bluth' },
            avatar: { type: 'string', example: 'https://reqres.in/img/faces/1-image.jpg' },
          },
        },
        SavedUser: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'george.bluth@reqres.in' },
            firstName: { type: 'string', example: 'George' },
            lastName: { type: 'string', example: 'Bluth' },
            avatar: { type: 'string', example: 'https://reqres.in/img/faces/1-image.jpg' },
            savedAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'My first post' },
            content: { type: 'string', example: 'This is the post content' },
            authorUserId: { type: 'integer', example: 1 },
            author: { $ref: '#/components/schemas/SavedUser', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePostRequest: {
          type: 'object',
          required: ['title', 'content', 'authorUserId'],
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 255, example: 'My first post' },
            content: { type: 'string', minLength: 10, example: 'Post body content here' },
            authorUserId: { type: 'integer', example: 1 },
          },
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 255 },
            content: { type: 'string', minLength: 10 },
            authorUserId: { type: 'integer' },
          },
        },
        PaginatedPosts: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
            total: { type: 'integer', example: 42 },
            page: { type: 'integer', example: 1 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
