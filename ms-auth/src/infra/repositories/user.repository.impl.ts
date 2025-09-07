import { Injectable, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { IUserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { PermissionEntity } from '../../domain/entities/permission.entity'
import { DATABASE_CONNECTION } from '../database/database.module'
import { users, permissions, userPermissions } from '../database/schemas'
import type {
	DatabaseConnection,
	UserUpdateData,
	UserPermissionData
} from '../../types/database.types'

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
				name: user.name,
				email: user.email,
				password: user.password,
				isActive: user.isActive
			})
			.returning()

		return new UserEntity(
			createdUser.id,
			createdUser.name,
			createdUser.email,
			createdUser.password,
			createdUser.isActive,
			createdUser.createdAt,
			createdUser.updatedAt
		)
	}

	async findById(id: string): Promise<UserEntity | null> {
		const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1)

		if (!user) return null

		return new UserEntity(
			user.id,
			user.name,
			user.email,
			user.password,
			user.isActive,
			user.createdAt,
			user.updatedAt
		)
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1)

		if (!user) return null

		return new UserEntity(
			user.id,
			user.name,
			user.email,
			user.password,
			user.isActive,
			user.createdAt,
			user.updatedAt
		)
	}

	async update(id: string, userData: Partial<UserEntity>): Promise<UserEntity> {
		const updateData: UserUpdateData = {
			updatedAt: new Date()
		}

		if (userData.name) updateData.name = userData.name
		if (userData.email) updateData.email = userData.email
		if (userData.password) updateData.password = userData.password
		if (userData.isActive !== undefined) updateData.isActive = userData.isActive

		const [updatedUser] = await this.db
			.update(users)
			.set(updateData)
			.where(eq(users.id, id))
			.returning()

		return new UserEntity(
			updatedUser.id,
			updatedUser.name,
			updatedUser.email,
			updatedUser.password,
			updatedUser.isActive,
			updatedUser.createdAt,
			updatedUser.updatedAt
		)
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(users).where(eq(users.id, id))
	}

	async assignPermissions(userId: string, permissionIds: string[]): Promise<void> {
		const userPermissionData: UserPermissionData[] = permissionIds.map((permissionId) => ({
			userId,
			permissionId
		}))

		await this.db.insert(userPermissions).values(userPermissionData)
	}

	async getUserPermissions(userId: string): Promise<PermissionEntity[]> {
		const result = await this.db
			.select({
				id: permissions.id,
				name: permissions.name,
				description: permissions.description,
				createdAt: permissions.createdAt,
				updatedAt: permissions.updatedAt
			})
			.from(userPermissions)
			.innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
			.where(eq(userPermissions.userId, userId))

		return result.map(
			(permission) =>
				new PermissionEntity(
					permission.id,
					permission.name,
					permission.description ?? undefined,
					permission.createdAt,
					permission.updatedAt
				)
		)
	}
}
