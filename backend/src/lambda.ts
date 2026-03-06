import serverless from 'serverless-http'
import app from './app'
import { AppDataSource } from './config/dataSource'

const serverlessApp = serverless(app)

export const handler = async (event: any, context: any) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  return serverlessApp(event, context)
}