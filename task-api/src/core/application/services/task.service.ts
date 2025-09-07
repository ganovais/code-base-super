import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { type ITaskRepository } from '../../../domain/repositories/task.repository'
import { TaskEntity, TaskStatus } from '../../../domain/entities/task.entity'
import { CreateTaskDto } from '../dtos/create-task.dto'
import { UpdateTaskDto } from '../dtos/update-task.dto'

@Injectable()
export class TaskService {
	constructor(
		@Inject('ITaskRepository')
		private readonly taskRepository: ITaskRepository
	) {}

	async create(createTaskDto: CreateTaskDto, userId: string): Promise<TaskEntity> {
		const { title, description } = createTaskDto

		const task = TaskEntity.create(title, description || null, userId)
		return this.taskRepository.create(task)
	}

	async findAllByUser(userId: string): Promise<TaskEntity[]> {
		return this.taskRepository.findByUserId(userId)
	}

	async findOne(id: string, userId: string): Promise<TaskEntity> {
		const task = await this.taskRepository.findByUserIdAndTaskId(userId, id)

		if (!task) {
			throw new NotFoundException('Task not found')
		}

		return task
	}

	async update(
		id: string,
		updateTaskDto: UpdateTaskDto,
		userId: string
	): Promise<TaskEntity> {
		const task = await this.taskRepository.findByUserIdAndTaskId(userId, id)

		if (!task) {
			throw new NotFoundException('Task not found')
		}

		let updatedTask = task

		// Handle title and description updates
		if (updateTaskDto.title || updateTaskDto.description !== undefined) {
			updatedTask = updatedTask.update(updateTaskDto.title, updateTaskDto.description)
		}

		// Handle status updates
		if (updateTaskDto.status === TaskStatus.COMPLETED) {
			updatedTask = updatedTask.complete()
		}

		return this.taskRepository.update(id, updatedTask)
	}

	async remove(id: string, userId: string): Promise<void> {
		const task = await this.taskRepository.findByUserIdAndTaskId(userId, id)

		if (!task) {
			throw new NotFoundException('Task not found')
		}

		await this.taskRepository.delete(id)
	}
}
