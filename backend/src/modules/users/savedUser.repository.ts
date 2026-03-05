import { AppDataSource } from '../../config/dataSource'
import { SavedUser } from '../../entities/SavedUser'

export const SavedUserRepository = AppDataSource.getRepository(SavedUser).extend({
  async findById(id: number): Promise<SavedUser | null> {
    return this.findOneBy({ id })
  },

  async findAllSaved(): Promise<SavedUser[]> {
    return this.find({ order: { savedAt: 'DESC' } })
  },

  async upsert(data: Omit<SavedUser, 'posts' | 'savedAt' | 'updatedAt'>): Promise<SavedUser> {
    const existing = await this.findOneBy({ id: data.id })
    if (existing) {
      this.merge(existing, data)
      return this.save(existing)
    }
    const user = this.create(data)
    return this.save(user)
  },

  async deleteById(id: number): Promise<boolean> {
    const result = await this.delete({ id })
    return (result.affected ?? 0) > 0
  },
})
