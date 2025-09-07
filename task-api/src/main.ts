import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
	// Create HTTP application
	const app = await NestFactory.create(AppModule)

	// Enable CORS
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:3003'],
		credentials: true
	})

	// Global validation pipe
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	// Set up microservice for RabbitMQ
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin123@localhost:5672'],
			queue: 'user_events_queue',
			queueOptions: {
				durable: true
			},
			socketOptions: {
				heartbeatIntervalInSeconds: 60,
				reconnectTimeInSeconds: 5
			}
		}
	})

	// Start both HTTP server and microservice
	await app.startAllMicroservices()

	const port = process.env.PORT || 3002
	await app.listen(port)
	console.log(`Task service running on port ${port}`)
	console.log('Task microservice is listening for RabbitMQ messages')
}
void bootstrap()
