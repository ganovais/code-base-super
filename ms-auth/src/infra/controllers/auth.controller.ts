import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common'
import { AuthService } from '../../core/application/services/auth.service'
import { RegisterDto } from '../../core/application/dtos/register.dto'
import { LoginDto } from '../../core/application/dtos/login.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body(ValidationPipe) registerDto: RegisterDto) {
		const result = await this.authService.register(registerDto)

		return {
			message: 'User registered successfully',
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				isActive: result.user.isActive,
				createdAt: result.user.createdAt
			},
			access_token: result.access_token
		}
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body(ValidationPipe) loginDto: LoginDto) {
		const result = await this.authService.login(loginDto)

		return {
			message: 'Login successful',
			user: {
				id: result.user.id,
				name: result.user.name,
				email: result.user.email,
				isActive: result.user.isActive,
				createdAt: result.user.createdAt
			},
			access_token: result.access_token
		}
	}
}
