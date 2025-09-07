import { Injectable, Inject } from '@nestjs/common'
import { eq, inArray } from 'drizzle-orm'
import { IPermissionRepository } from '../../domain/repositories/permission.repository'
import { PermissionEntity } from '../../domain/entities/permission.entity'
import { DATABASE_CONNECTION } from '../database/database.module'
import { permissions } from '../database/schemas'
import type { DatabaseConnection, PermissionUpdateData } from '../../types/database.types'

@Injectable()
export class PermissionRepositoryImpl implements IPermissionRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: DatabaseConnection
	) {}

	async create(permission: PermissionEntity): Promise<PermissionEntity> {
		const [createdPermission] = await this.db
			.insert(permissions)
			.values({
				name: permission.name,
				description: permission.description ?? undefined
			})
			.returning()

		return new PermissionEntity(
			createdPermission.id,
			createdPermission.name,
			createdPermission.description ?? undefined,
			createdPermission.createdAt,
			createdPermission.updatedAt
		)
	}

	async findById(id: string): Promise<PermissionEntity | null> {
		const [permission] = await this.db
			.select()
			.from(permissions)
			.where(eq(permissions.id, id))
			.limit(1)

		if (!permission) return null

		return new PermissionEntity(
			permission.id,
			permission.name,
			permission.description ?? undefined,
			permission.createdAt,
			permission.updatedAt
		)
	}

	async findByName(name: string): Promise<PermissionEntity | null> {
		const [permission] = await this.db
			.select()
			.from(permissions)
			.where(eq(permissions.name, name))
			.limit(1)

		if (!permission) return null

		return new PermissionEntity(
			permission.id,
			permission.name,
			permission.description ?? undefined,
			permission.createdAt,
			permission.updatedAt
		)
	}

	async findAll(): Promise<PermissionEntity[]> {
		const result = await this.db.select().from(permissions)

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

	async findByNames(names: string[]): Promise<PermissionEntity[]> {
		if (names.length === 0) return []

		const result = await this.db.select().from(permissions).where(inArray(permissions.name, names))

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

	async update(id: string, permissionData: Partial<PermissionEntity>): Promise<PermissionEntity> {
		const updateData: PermissionUpdateData = {
			updatedAt: new Date()
		}

		if (permissionData.name) updateData.name = permissionData.name
		if (permissionData.description) updateData.description = permissionData.description

		const [updatedPermission] = await this.db
			.update(permissions)
			.set(updateData)
			.where(eq(permissions.id, id))
			.returning()

		return new PermissionEntity(
			updatedPermission.id,
			updatedPermission.name,
			updatedPermission.description ?? undefined,
			updatedPermission.createdAt,
			updatedPermission.updatedAt
		)
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(permissions).where(eq(permissions.id, id))
	}
}
