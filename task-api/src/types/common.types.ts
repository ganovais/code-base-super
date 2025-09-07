// Request headers from API Gateway
export interface GatewayHeaders extends Record<string, string | string[] | undefined> {
	'x-user-id'?: string
	'x-user-email'?: string
	'x-user-permissions'?: string
}

// User information extracted from headers
export interface AuthenticatedUser {
	id: string
	email?: string
	permissions?: string[]
}

// Task response format
export interface TaskResponse {
	id: string
	title: string
	description: string | null
	status: string
	createdAt: Date
	updatedAt: Date
}

// API response wrapper
export interface ApiResponse<T = unknown> {
	message: string
	data?: T
}

// Tasks list response
export interface TasksListResponse extends ApiResponse {
	tasks: TaskResponse[]
}

// Single task response
export interface SingleTaskResponse extends ApiResponse {
	task: TaskResponse
}

// User created event from RabbitMQ
export interface UserCreatedEvent {
	userId: string
	name: string
	email: string
}
