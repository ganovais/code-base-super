import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest, JwtPayload } from '../types/common.types'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	use(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
		// Skip auth for login and register routes
		if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
			return next()
		}

		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token provided')
		}

		const token = authHeader.substring(7)

		try {
			const jwtSecret = this.configService.get<string>('JWT_SECRET')
			if (!jwtSecret) {
				throw new Error('JWT_SECRET is not configured')
			}

			const payload = this.jwtService.verify<JwtPayload>(token, {
				secret: jwtSecret
			})

			req.user = {
				id: payload.sub,
				email: payload.email,
				permissions: payload.permissions
			}

			next()
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException(error.message)
			}
			throw new UnauthorizedException('Invalid token')
		}
	}
}
