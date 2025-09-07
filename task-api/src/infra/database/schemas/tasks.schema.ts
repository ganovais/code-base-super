import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users.schema'

export enum TaskStatus {
	PENDING = 'pending',
	COMPLETED = 'completed'
}

export const tasks = pgTable('tasks', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	status: varchar('status', { length: 20 }).notNull().default(TaskStatus.PENDING),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
