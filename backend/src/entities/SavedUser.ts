import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Post } from './Post'

@Entity('saved_users')
export class SavedUser {
  @PrimaryColumn()
  id!: number

  @Column()
  email!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ nullable: true })
  avatar!: string

  @CreateDateColumn()
  savedAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @OneToMany(() => Post, (post) => post.author)
  posts!: Post[]
}
