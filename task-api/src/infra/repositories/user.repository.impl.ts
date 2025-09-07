import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { IUserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { DATABASE_CONNECTION } from '../database/database.module'
import { users } from '../database/schemas'
import { type DatabaseConnection } from '../../types/database.types'

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: DatabaseConnection
	) {}

	async create(user: UserEntity): Promise<UserEntity> {
		const [createdUser] = await this.db
			.insert(users)
			.values({
				id: user.id,
				name: user.name,
				email: user.email
			})
			.returning()

		return new UserEntity(
			createdUser.id,
			createdUser.name,
			createdUser.email,
			createdUser.createdAt,
			createdUser.updatedAt
		)
	}

	async findById(id: string): Promise<UserEntity | null> {
		const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1)

		if (!user) return null

		return new UserEntity(user.id, user.name, user.email, user.createdAt, user.updatedAt)
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const [user] = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)

		if (!user) return null

		return new UserEntity(user.id, user.name, user.email, user.createdAt, user.updatedAt)
	}
}
