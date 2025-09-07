import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infra/database/database.module'
import { MessagingModule } from './infra/messaging/messaging.module'
import { TaskController } from './infra/controllers/task.controller'
import { TaskService } from './core/application/services/task.service'
import { TaskRepositoryImpl } from './infra/repositories/task.repository.impl'
import { UserRepositoryImpl } from './infra/repositories/user.repository.impl'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		DatabaseModule,
		MessagingModule
	],
	controllers: [TaskController],
	providers: [
		TaskService,
		{
			provide: 'ITaskRepository',
			useClass: TaskRepositoryImpl
		},
		{
			provide: 'IUserRepository',
			useClass: UserRepositoryImpl
		}
	]
})
export class AppModule {}
