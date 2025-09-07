import { Injectable, Logger, Inject } from '@nestjs/common'
import { type IUserRepository } from '../../domain/repositories/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { UserCreatedEvent } from '../../types/common.types'

@Injectable()
export class UserEventService {
	private readonly logger = new Logger(UserEventService.name)

	constructor(
		@Inject('IUserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async handleUserCreated(event: UserCreatedEvent): Promise<void> {
		try {
			this.logger.log(`Processing user created event: ${event.userId}`)

			// Check if user already exists
			const existingUser = await this.userRepository.findById(event.userId)
			if (existingUser) {
				this.logger.log(`User ${event.userId} already exists, skipping`)
				return
			}

			// Create user in local database
			const user = UserEntity.create(event.userId, event.name, event.email)
			await this.userRepository.create(user)

			this.logger.log(`User ${event.userId} created successfully in task service`)
		} catch (error: unknown) {
			this.logger.error(`Failed to handle user created event: ${event.userId}`, error)
			throw error
		}
	}
}
