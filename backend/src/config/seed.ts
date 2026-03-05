import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'
import { AppDataSource } from './dataSource'
import { SavedUser } from '../entities/SavedUser'
import { Post } from '../entities/Post'

const seed = async (): Promise<void> => {
  await AppDataSource.initialize()
  console.log('✅ Database connected')

  const userRepo = AppDataSource.getRepository(SavedUser)
  const postRepo = AppDataSource.getRepository(Post)

  // Limpio data
  await postRepo.delete({})
  await userRepo.delete({})
  console.log('🗑️  Cleared existing data')

  // Seed users (similar a ReqRes user structure)
  const users = userRepo.create([
    {
      id: 1,
      email: 'george.bluth@reqres.in',
      firstName: 'George',
      lastName: 'Bluth',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
    },
    {
      id: 2,
      email: 'janet.weaver@reqres.in',
      firstName: 'Janet',
      lastName: 'Weaver',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
    },
    {
      id: 3,
      email: 'emma.wong@reqres.in',
      firstName: 'Emma',
      lastName: 'Wong',
      avatar: 'https://reqres.in/img/faces/3-image.jpg',
    },
  ])

  await userRepo.save(users)
  console.log(`🌱 Seeded ${users.length} users`)

  // Seed posts
  const posts = postRepo.create([
    {
      title: 'Getting Started with TypeScript',
      content: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
      authorUserId: 1,
    },
    {
      title: 'Why PostgreSQL?',
      content: 'PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development.',
      authorUserId: 2,
    },
    {
      title: 'REST API Best Practices',
      content: 'Building a REST API requires careful planning around resource naming, HTTP methods, status codes, and error handling.',
      authorUserId: 3,
    },
  ])

  await postRepo.save(posts)
  console.log(`🌱 Seeded ${posts.length} posts`)

  await AppDataSource.destroy()
  console.log('✅ Seed complete')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})