import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventProxyService } from './event-proxy.service'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'MESSAGING_SERVICE',
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin123@rabbitmq:5672')
						],
						queue: 'gateway_events_queue',
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
	providers: [EventProxyService],
	exports: [EventProxyService, ClientsModule]
})
export class MicroservicesModule {}
