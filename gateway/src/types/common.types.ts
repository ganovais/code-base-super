import { Request } from 'express'

// HTTP Methods enum for better type safety
export enum HttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE'
}

// JWT payload interface
export interface JwtPayload {
	sub: string
	email: string
	permissions: string[]
	iat?: number
	exp?: number
}

// User information from JWT
export interface AuthenticatedUser {
	id: string
	email: string
	permissions: string[]
}

// Extended request interface with user information
export interface AuthenticatedRequest extends Request {
	user?: AuthenticatedUser
}

// Proxy service configuration
export interface ProxyConfig {
	msAuthUrl: string
	taskApiUrl: string
}

// Error response interface
export interface ErrorResponse {
	message: string
	statusCode?: number
	error?: string
}

// Forward headers interface
export interface ForwardHeaders extends Record<string, string> {
	'x-user-id'?: string
	'x-user-email'?: string
	'x-user-permissions'?: string
}

// Generic API response
export interface ApiResponse<T = unknown> {
	data?: T
	message?: string
	error?: string
}
