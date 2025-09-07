import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserEventController } from './user-event.controller'
import { UserEventService } from './user-event.service'
import { UserRepositoryImpl } from '../repositories/user.repository.impl'

@Module({
	imports: [ConfigModule],
	controllers: [UserEventController],
	providers: [
		UserEventService,
		{
			provide: 'IUserRepository',
			useClass: UserRepositoryImpl
		}
	],
	exports: [UserEventService]
})
export class MessagingModule {}
