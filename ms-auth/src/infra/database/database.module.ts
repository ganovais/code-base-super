import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schemas from './schemas'
import { DatabaseConnection } from '../../types/database.types'

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION'

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		{
			provide: DATABASE_CONNECTION,
			inject: [ConfigService],
			useFactory: (configService: ConfigService): DatabaseConnection => {
				const connectionString = configService.get<string>('DATABASE_URL')

				if (!connectionString) {
					throw new Error('DATABASE_URL is not configured')
				}

				const pool = new Pool({
					connectionString
				})

				return drizzle(pool, { schema: schemas })
			}
		}
	],
	exports: [DATABASE_CONNECTION]
})
export class DatabaseModule {}
