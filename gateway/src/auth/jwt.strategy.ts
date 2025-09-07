import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

export interface JwtPayload {
	sub: string // user ID
	email: string
	permissions: string[]
	iat?: number
	exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_SECRET')
		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined in configuration')
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret
		})
	}

	validate(payload: JwtPayload) {
		return {
			id: payload.sub,
			email: payload.email,
			permissions: payload.permissions
		}
	}
}
