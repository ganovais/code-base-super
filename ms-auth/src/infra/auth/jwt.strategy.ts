import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayloadDto } from '../../core/application/dtos/jwt-payload.dto'
import { AuthService } from '../../core/application/services/auth.service'
import { ValidatedUser } from '../../types/auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly authService: AuthService
	) {
		const secret = configService.get<string>('JWT_SECRET')
		if (!secret) {
			throw new Error('JWT_SECRET is required but not defined in environment variables')
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret
		})
	}

	async validate(payload: JwtPayloadDto): Promise<ValidatedUser> {
		const user = await this.authService.validateUser(payload)
		const result: ValidatedUser = {
			id: payload.sub,
			email: payload.email,
			permissions: payload.permissions
		}

		if (user) {
			result.user = user
		}

		return result
	}
}
