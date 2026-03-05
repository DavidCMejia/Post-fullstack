import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SavedUser } from './SavedUser'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255 })
  title!: string

  @Column('text')
  content!: string

  @Column()
  authorUserId!: number

  @ManyToOne(() => SavedUser, (user) => user.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'authorUserId' })
  author!: SavedUser | null

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
