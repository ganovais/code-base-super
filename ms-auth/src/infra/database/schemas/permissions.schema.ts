import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const permissions = pgTable('permissions', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 100 }).unique().notNull(),
	description: varchar('description', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Permission = typeof permissions.$inferSelect
export type NewPermission = typeof permissions.$inferInsert
