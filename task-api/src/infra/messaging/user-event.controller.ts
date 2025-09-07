import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { UserEventService } from './user-event.service'
import { type UserCreatedEvent } from '../../types/common.types'

@Controller()
export class UserEventController {
	private readonly logger = new Logger(UserEventController.name)

	constructor(private readonly userEventService: UserEventService) {}

	@EventPattern('user.created')
	async handleUserCreated(@Payload() data: UserCreatedEvent): Promise<void> {
		this.logger.log(`Received user created event: ${data.userId}`)
		try {
			await this.userEventService.handleUserCreated(data)
			this.logger.log(`Successfully processed user created event: ${data.userId}`)
		} catch (error) {
			this.logger.error(`Failed to process user created event: ${data.userId}`, error)
			throw error
		}
	}

	@MessagePattern('user.created.notification')
	async handleUserCreatedNotification(
		@Payload() data: UserCreatedEvent
	): Promise<{ success: boolean; message: string }> {
		this.logger.log(`Received user created notification: ${data.userId}`)
		try {
			await this.userEventService.handleUserCreated(data)
			const response = {
				success: true,
				message: `User ${data.userId} processed successfully in task service`
			}
			this.logger.log(`Successfully processed user created notification: ${data.userId}`)
			return response
		} catch (error) {
			this.logger.error(
				`Failed to process user created notification: ${data.userId}`,
				error
			)
			let errorMessage = 'Unknown error'
			if (error instanceof Error) {
				errorMessage = error.message
			}
			return {
				success: false,
				message: `Failed to process user ${data.userId}: ${errorMessage}`
			}
		}
	}
}
