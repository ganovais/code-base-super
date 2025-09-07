import { HttpException } from '@nestjs/common'

// Custom error class for proxy errors
export class ProxyError extends HttpException {
	constructor(
		message: string,
		statusCode: number,
		public readonly originalError?: unknown
	) {
		super(message, statusCode)
	}
}

// Type guard for checking if error has status property
export function hasStatus(error: unknown): error is { status: number; response?: unknown } {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		typeof (error as { status: unknown }).status === 'number'
	)
}

// Type guard for checking if error is an Error instance
export function isError(error: unknown): error is Error {
	return error instanceof Error
}

// Get safe error message from unknown error
export function getErrorMessage(error: unknown): string {
	if (isError(error)) {
		return error.message
	}

	if (typeof error === 'string') {
		return error
	}

	return 'Unknown error occurred'
}
