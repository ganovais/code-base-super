import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator'
import { TaskStatus } from '../../../domain/entities/task.entity'

export class UpdateTaskDto {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	title?: string

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus
}
