import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { DatabaseModule } from './infra/database/database.module'
import { MessagingModule } from './infra/messaging/messaging.module'
import { AuthController } from './infra/controllers/auth.controller'
import { AuthService } from './core/application/services/auth.service'
import { UserRepositoryImpl } from './infra/repositories/user.repository.impl'
import { PermissionRepositoryImpl } from './infra/repositories/permission.repository.impl'
import { EventEmitterService } from './infra/messaging/event-emitter.service'
import { JwtStrategy } from './infra/auth/jwt.strategy'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				const secret = configService.get<string>('JWT_SECRET')
				if (!secret) {
					throw new Error('JWT_SECRET is required but not defined in environment variables')
				}
				return {
					secret,
					signOptions: {
						expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
						algorithm: 'HS256' as const
					}
				}
			},
			inject: [ConfigService]
		}),
		DatabaseModule,
		MessagingModule
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: 'IUserRepository',
			useClass: UserRepositoryImpl
		},
		{
			provide: 'IPermissionRepository',
			useClass: PermissionRepositoryImpl
		},
		EventEmitterService,
		JwtStrategy
	]
})
export class AppModule {}
