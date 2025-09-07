import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import type { IUserRepository } from '../../../domain/repositories/user.repository'
import type { IPermissionRepository } from '../../../domain/repositories/permission.repository'
import { UserEntity } from '../../../domain/entities/user.entity'
import { RegisterDto } from '../dtos/register.dto'
import { LoginDto } from '../dtos/login.dto'
import { JwtPayloadDto } from '../dtos/jwt-payload.dto'
import { EventEmitterService } from '../../../infra/messaging/event-emitter.service'
import { AuthResponse } from '../../../types/auth.types'

@Injectable()
export class AuthService {
	constructor(
		@Inject('IUserRepository')
		private readonly userRepository: IUserRepository,
		@Inject('IPermissionRepository')
		private readonly permissionRepository: IPermissionRepository,
		private readonly jwtService: JwtService,
		private readonly eventEmitter: EventEmitterService
	) {}

	async register(registerDto: RegisterDto): Promise<AuthResponse> {
		const { name, email, password } = registerDto

		// Check if user already exists
		const existingUser = await this.userRepository.findByEmail(email)
		if (existingUser) {
			throw new ConflictException('User with this email already exists')
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10)

		// Create user
		const user = UserEntity.create(name, email, hashedPassword)
		const createdUser = await this.userRepository.create(user)

		// Assign default permissions
		const defaultPermissions = await this.permissionRepository.findByNames([
			'create:task',
			'read:task',
			'update:task',
			'delete:task'
		])

		if (defaultPermissions.length > 0) {
			await this.userRepository.assignPermissions(
				createdUser.id,
				defaultPermissions.map((p) => p.id)
			)
		}

		// Emit user created event
		await this.eventEmitter.emitUserCreated({
			userId: createdUser.id,
			name: createdUser.name,
			email: createdUser.email
		})

		// Generate JWT
		const userPermissions = await this.userRepository.getUserPermissions(createdUser.id)
		const payload: JwtPayloadDto = {
			sub: createdUser.id,
			email: createdUser.email,
			permissions: userPermissions.map((p) => p.name)
		}

		const access_token = this.jwtService.sign(payload)

		return {
			user: createdUser,
			access_token
		}
	}

	async login(loginDto: LoginDto): Promise<AuthResponse> {
		const { email, password } = loginDto

		// Find user
		const user = await this.userRepository.findByEmail(email)
		if (!user || !user.isActive) {
			throw new UnauthorizedException('Invalid credentials')
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials')
		}

		// Get user permissions
		const userPermissions = await this.userRepository.getUserPermissions(user.id)
		const payload: JwtPayloadDto = {
			sub: user.id,
			email: user.email,
			permissions: userPermissions.map((p) => p.name)
		}

		const access_token = this.jwtService.sign(payload)

		return {
			user,
			access_token
		}
	}

	async validateUser(payload: JwtPayloadDto): Promise<UserEntity | null> {
		return this.userRepository.findById(payload.sub)
	}
}
