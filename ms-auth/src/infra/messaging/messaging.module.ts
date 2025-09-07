import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterService } from './event-emitter.service'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'USER_SERVICE',
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin123@rabbitmq:5672')
						],
						queue: 'user_events_queue',
						queueOptions: {
							durable: true
						},
						socketOptions: {
							heartbeatIntervalInSeconds: 60,
							reconnectTimeInSeconds: 5
						}
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	providers: [EventEmitterService],
	exports: [EventEmitterService, ClientsModule]
})
export class MessagingModule {}
