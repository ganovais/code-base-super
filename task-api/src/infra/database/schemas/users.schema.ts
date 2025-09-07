import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

// Mirror of users from auth service for local referential integrity
export const users = pgTable('users', {
	id: uuid('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
