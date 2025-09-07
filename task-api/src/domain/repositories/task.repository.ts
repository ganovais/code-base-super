import { TaskEntity } from '../entities/task.entity'

export interface ITaskRepository {
	create(task: TaskEntity): Promise<TaskEntity>
	findById(id: string): Promise<TaskEntity | null>
	findByUserId(userId: string): Promise<TaskEntity[]>
	update(id: string, task: Partial<TaskEntity>): Promise<TaskEntity>
	delete(id: string): Promise<void>
	findByUserIdAndTaskId(userId: string, taskId: string): Promise<TaskEntity | null>
}
