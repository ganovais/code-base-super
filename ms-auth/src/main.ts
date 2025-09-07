import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
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

	const port = process.env.PORT || 3001
	await app.listen(port)
	console.log(`Authentication service running on port ${port}`)
}

void bootstrap()
