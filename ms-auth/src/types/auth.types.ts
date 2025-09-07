import { UserEntity } from '../domain/entities/user.entity'

// Authentication response type
export interface AuthResponse {
	user: UserEntity
	access_token: string
}

// User created event type
export interface UserCreatedEvent {
	userId: string
	name: string
	email: string
}

// JWT payload type
export interface JwtPayload {
	sub: string
	email: string
	permissions: string[]
	iat?: number
	exp?: number
}

// Validated user type (from JWT strategy)
export interface ValidatedUser {
	id: string
	email: string
	permissions: string[]
	user?: UserEntity
}
