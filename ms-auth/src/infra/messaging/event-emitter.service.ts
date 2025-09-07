import { Injectable, Logger, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, timeout } from 'rxjs/operators'
import { throwError, firstValueFrom } from 'rxjs'

import { UserCreatedEvent } from '../../types/auth.types'

@Injectable()
export class EventEmitterService {
	private readonly logger = new Logger(EventEmitterService.name)

	constructor(
		@Inject('USER_SERVICE')
		private readonly userServiceClient: ClientProxy
	) {}

	async emitUserCreated(event: UserCreatedEvent): Promise<void> {
		try {
			this.logger.log(`Emitting user created event: ${event.userId}`)

			// Emit event using NestJS microservices pattern
			const result$ = this.userServiceClient.emit('user.created', event).pipe(
				timeout(5000), // 5 second timeout
				catchError((error) => {
					this.logger.error('Failed to emit user created event', error)
					return throwError(() => error)
				})
			)

			await firstValueFrom(result$)
			this.logger.log(`User created event emitted successfully: ${event.userId}`)
		} catch (error) {
			this.logger.error('Failed to emit user created event', error)
			throw error
		}
	}

	async notifyUserCreated(event: UserCreatedEvent): Promise<void> {
		try {
			this.logger.log(`Sending user created notification: ${event.userId}`)

			// Send message using request-response pattern for acknowledgment
			const result$ = this.userServiceClient.send('user.created.notification', event).pipe(
				timeout(10000), // 10 second timeout for request-response
				catchError((error) => {
					this.logger.error('Failed to send user created notification', error)
					return throwError(() => error)
				})
			)

			const response = await firstValueFrom(result$)
			this.logger.log(`User created notification sent successfully: ${event.userId}`, response)
		} catch (error) {
			this.logger.error('Failed to send user created notification', error)
			// Don't throw here to avoid breaking the main flow
		}
	}
}
