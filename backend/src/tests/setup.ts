import dotenv from 'dotenv'
dotenv.config({ path: '.env.example' })

process.env.JWT_SECRET = 'test_secret'
process.env.NODE_ENV = 'test'
