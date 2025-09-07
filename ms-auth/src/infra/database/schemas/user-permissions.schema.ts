import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { permissions } from './permissions.schema'

export const userPermissions = pgTable(
	'user_permissions',
	{
		userId: uuid('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		permissionId: uuid('permission_id')
			.references(() => permissions.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.permissionId] })
		}
	}
)

export type UserPermission = typeof userPermissions.$inferSelect
export type NewUserPermission = typeof userPermissions.$inferInsert
