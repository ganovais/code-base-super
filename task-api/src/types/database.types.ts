import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schemas from '../infra/database/schemas'

// Database connection type
export type DatabaseConnection = NodePgDatabase<typeof schemas>

// Task update data type
export interface TaskUpdateData {
	title?: string
	description?: string | null
	status?: string
	updatedAt?: Date
}

// User data for task service (mirror from auth service)
export interface UserData {
	id: string
	name: string
	email: string
}
