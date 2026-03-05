import { AppDataSource } from './config/dataSource'
import app from './app'

const PORT = process.env.PORT ?? 4000

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err: unknown) => {
    console.error('❌ Database connection failed:', err)
    process.exit(1)
  })
