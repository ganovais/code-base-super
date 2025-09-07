import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schemas from '../infra/database/schemas'

// Database connection type
export type DatabaseConnection = NodePgDatabase<typeof schemas>

// User update data type
export interface UserUpdateData {
	name?: string
	email?: string
	password?: string
	isActive?: boolean
	updatedAt?: Date
}

// Permission update data type
export interface PermissionUpdateData {
	name?: string
	description?: string
	updatedAt?: Date
}

// User permission assignment data
export interface UserPermissionData {
	userId: string
	permissionId: string
}
