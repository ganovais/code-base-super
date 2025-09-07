import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { GatewayController } from './proxy/gateway.controller'
import { ProxyService } from './proxy/proxy.service'
import { AuthMiddleware } from './middleware/auth.middleware'
import { JwtStrategy } from './auth/jwt.strategy'
import { MicroservicesModule } from './microservices/microservices.module'

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
					throw new Error('JWT_SECRET is not defined in environment variables')
				}
				return {
					secret,
					signOptions: {
						expiresIn: '24h',
						algorithm: 'HS256'
					}
				}
			},
			inject: [ConfigService]
		}),
		MicroservicesModule
	],
	controllers: [GatewayController],
	providers: [ProxyService, AuthMiddleware, JwtStrategy]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({ path: 'api/*', method: RequestMethod.ALL })
	}
}
