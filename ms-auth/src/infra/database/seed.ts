import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { permissions } from './schemas'

async function seedPermissions() {
	const connectionString =
		process.env.DATABASE_URL || 'postgresql://auth_user:auth_password@localhost:5432/auth_db'

	const pool = new Pool({ connectionString })
	const db = drizzle(pool)

	const defaultPermissions = [
		{ name: 'create:task', description: 'Create new tasks' },
		{ name: 'read:task', description: 'Read tasks' },
		{ name: 'update:task', description: 'Update existing tasks' },
		{ name: 'delete:task', description: 'Delete tasks' }
	]

	try {
		console.log('Seeding permissions...')

		for (const permission of defaultPermissions) {
			try {
				await db.insert(permissions).values(permission)
			} catch (error) {
				// Ignore duplicate key errors
				if (error instanceof Error && !error.message.includes('duplicate key')) {
					throw error
				}
			}
		}

		console.log('Permissions seeded successfully')
	} catch (error) {
		console.error('Error seeding permissions:', error)
	} finally {
		await pool.end()
	}
}

if (require.main === module) {
	void seedPermissions()
}

export { seedPermissions }
