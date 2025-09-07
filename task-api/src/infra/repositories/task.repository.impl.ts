import { Injectable, Inject } from '@nestjs/common'
import { eq, and } from 'drizzle-orm'
import { ITaskRepository } from '../../domain/repositories/task.repository'
import { TaskEntity, TaskStatus } from '../../domain/entities/task.entity'
import { DATABASE_CONNECTION } from '../database/database.module'
import { tasks } from '../database/schemas'
import { type DatabaseConnection, TaskUpdateData } from '../../types/database.types'

@Injectable()
export class TaskRepositoryImpl implements ITaskRepository {
	constructor(
		@Inject(DATABASE_CONNECTION)
		private readonly db: DatabaseConnection
	) {}

	async create(task: TaskEntity): Promise<TaskEntity> {
		const [createdTask] = await this.db
			.insert(tasks)
			.values({
				title: task.title,
				description: task.description,
				status: task.status,
				userId: task.userId
			})
			.returning()

		return new TaskEntity(
			createdTask.id,
			createdTask.title,
			createdTask.description,
			createdTask.status as TaskStatus,
			createdTask.userId,
			createdTask.createdAt,
			createdTask.updatedAt
		)
	}

	async findById(id: string): Promise<TaskEntity | null> {
		const [task] = await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1)

		if (!task) return null

		return new TaskEntity(
			task.id,
			task.title,
			task.description,
			task.status as TaskStatus,
			task.userId,
			task.createdAt,
			task.updatedAt
		)
	}

	async findByUserId(userId: string): Promise<TaskEntity[]> {
		const result = await this.db
			.select()
			.from(tasks)
			.where(eq(tasks.userId, userId))
			.orderBy(tasks.createdAt)

		return result.map(
			(task) =>
				new TaskEntity(
					task.id,
					task.title,
					task.description,
					task.status as TaskStatus,
					task.userId,
					task.createdAt,
					task.updatedAt
				)
		)
	}

	async findByUserIdAndTaskId(
		userId: string,
		taskId: string
	): Promise<TaskEntity | null> {
		const [task] = await this.db
			.select()
			.from(tasks)
			.where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
			.limit(1)

		if (!task) return null

		return new TaskEntity(
			task.id,
			task.title,
			task.description,
			task.status as TaskStatus,
			task.userId,
			task.createdAt,
			task.updatedAt
		)
	}

	async update(id: string, taskData: Partial<TaskEntity>): Promise<TaskEntity> {
		const updateData: TaskUpdateData = {
			updatedAt: new Date()
		}

		if (taskData.title) updateData.title = taskData.title
		if (taskData.description !== undefined) updateData.description = taskData.description
		if (taskData.status) updateData.status = taskData.status

		const [updatedTask] = await this.db
			.update(tasks)
			.set(updateData)
			.where(eq(tasks.id, id))
			.returning()

		return new TaskEntity(
			updatedTask.id,
			updatedTask.title,
			updatedTask.description,
			updatedTask.status as TaskStatus,
			updatedTask.userId,
			updatedTask.createdAt,
			updatedTask.updatedAt
		)
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(tasks).where(eq(tasks.id, id))
	}
}
