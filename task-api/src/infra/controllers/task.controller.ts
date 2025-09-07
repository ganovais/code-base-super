import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Headers,
	ValidationPipe,
	HttpCode,
	HttpStatus,
	BadRequestException
} from '@nestjs/common'
import { TaskService } from '../../core/application/services/task.service'
import { CreateTaskDto } from '../../core/application/dtos/create-task.dto'
import { UpdateTaskDto } from '../../core/application/dtos/update-task.dto'
import { TaskEntity } from '../../domain/entities/task.entity'
import type {
	GatewayHeaders,
	TaskResponse,
	TasksListResponse,
	SingleTaskResponse
} from '../../types/common.types'

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	private getUserIdFromHeaders(headers: GatewayHeaders): string {
		const userId = headers['x-user-id']
		if (!userId || typeof userId !== 'string') {
			throw new BadRequestException('User ID not found in headers')
		}
		return userId
	}

	private mapTaskToResponse(task: TaskEntity): TaskResponse {
		return {
			id: task.id,
			title: task.title,
			description: task.description,
			status: task.status,
			createdAt: task.createdAt,
			updatedAt: task.updatedAt
		}
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body(ValidationPipe) createTaskDto: CreateTaskDto,
		@Headers() headers: GatewayHeaders
	): Promise<SingleTaskResponse> {
		const userId = this.getUserIdFromHeaders(headers)
		const task = await this.taskService.create(createTaskDto, userId)

		return {
			message: 'Task created successfully',
			task: this.mapTaskToResponse(task)
		}
	}

	@Get()
	async findAll(@Headers() headers: GatewayHeaders): Promise<TasksListResponse> {
		const userId = this.getUserIdFromHeaders(headers)
		const tasks = await this.taskService.findAllByUser(userId)

		return {
			message: 'Tasks retrieved successfully',
			tasks: tasks.map((task) => this.mapTaskToResponse(task))
		}
	}

	@Get(':id')
	async findOne(
		@Param('id') id: string,
		@Headers() headers: GatewayHeaders
	): Promise<SingleTaskResponse> {
		const userId = this.getUserIdFromHeaders(headers)
		const task = await this.taskService.findOne(id, userId)

		return {
			message: 'Task retrieved successfully',
			task: this.mapTaskToResponse(task)
		}
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
		@Headers() headers: GatewayHeaders
	): Promise<SingleTaskResponse> {
		const userId = this.getUserIdFromHeaders(headers)
		const task = await this.taskService.update(id, updateTaskDto, userId)

		return {
			message: 'Task updated successfully',
			task: this.mapTaskToResponse(task)
		}
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(
		@Param('id') id: string,
		@Headers() headers: GatewayHeaders
	): Promise<void> {
		const userId = this.getUserIdFromHeaders(headers)
		await this.taskService.remove(id, userId)
	}
}
