import { Injectable, Inject, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom, timeout, catchError } from 'rxjs'
import { throwError } from 'rxjs'

@Injectable()
export class EventProxyService {
	private readonly logger = new Logger(EventProxyService.name)

	constructor(
		@Inject('MESSAGING_SERVICE')
		private readonly messagingClient: ClientProxy
	) {}

	async emitEvent(pattern: string, data: any): Promise<void> {
		try {
			this.logger.log(`Emitting event: ${pattern}`)

			const result$ = this.messagingClient.emit(pattern, data).pipe(
				timeout(5000), // 5 second timeout for emit
				catchError((error: unknown) => {
					this.logger.error(`Error emitting event ${pattern}:`, error)
					return throwError(() => error)
				})
			)

			await firstValueFrom(result$)
			this.logger.log(`Event emitted successfully: ${pattern}`)
		} catch (error) {
			this.logger.error(`Failed to emit event ${pattern}:`, error)
			// Don't throw for emit operations as they are fire-and-forget
		}
	}

	async sendMessage(pattern: string, data: any): Promise<any> {
		try {
			this.logger.log(`Sending message: ${pattern}`)

			const result$ = this.messagingClient.send(pattern, data).pipe(
				timeout(10000), // 10 second timeout
				catchError((error: unknown) => {
					this.logger.error(`Error sending message ${pattern}:`, error)
					return throwError(() => error)
				})
			)

			const response = await firstValueFrom(result$)
			this.logger.log(`Message response received for pattern: ${pattern}`)
			return response
		} catch (error) {
			this.logger.error(`Failed to send message ${pattern}:`, error)
			throw error
		}
	}
}
