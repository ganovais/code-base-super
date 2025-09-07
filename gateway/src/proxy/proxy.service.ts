import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosResponse, Method } from 'axios'
import { ProxyError, getErrorMessage } from '../types/error.types'

@Injectable()
export class ProxyService {
	private readonly msAuthUrl: string
	private readonly taskApiUrl: string

	constructor(private readonly configService: ConfigService) {
		const msAuthUrl = this.configService.get<string>('MS_AUTH_URL')
		const taskApiUrl = this.configService.get<string>('TASK_API_URL')

		if (!msAuthUrl || !taskApiUrl) {
			throw new Error('MS_AUTH_URL and TASK_API_URL must be configured')
		}

		this.msAuthUrl = msAuthUrl
		this.taskApiUrl = taskApiUrl
	}

	async forwardToAuthService(
		method: string,
		path: string,
		data?: unknown,
		headers?: Record<string, string>
	): Promise<AxiosResponse> {
		try {
			const url = `${this.msAuthUrl}${path}`

			return await axios({
				method: method.toUpperCase() as Method,
				url,
				data,
				headers: {
					'Content-Type': 'application/json',
					...headers
				}
			})
		} catch (error) {
			this.handleProxyError(error)
		}
	}

	async forwardToTaskService(
		method: string,
		path: string,
		data?: unknown,
		headers?: Record<string, string>
	): Promise<AxiosResponse> {
		try {
			const url = `${this.taskApiUrl}${path}`

			return await axios({
				method: method.toUpperCase() as Method,
				url,
				data,
				headers: {
					'Content-Type': 'application/json',
					...headers
				}
			})
		} catch (error) {
			this.handleProxyError(error)
		}
	}

	private handleProxyError(error: unknown): never {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// The request was made and the server responded with a status code
				const data = error.response.data as unknown
				let errorMessage = 'Service error'

				if (
					typeof data === 'object' &&
					data !== null &&
					Object.prototype.hasOwnProperty.call(data, 'message') &&
					typeof (data as { message?: unknown }).message === 'string'
				) {
					errorMessage = (data as { message: string }).message
				}

				throw new ProxyError(errorMessage, error.response.status, error)
			} else if (error.request) {
				// The request was made but no response was received
				throw new ProxyError('Service unavailable', 503, error)
			}
		}

		// Something happened in setting up the request or other error
		throw new ProxyError(getErrorMessage(error) || 'Internal server error', 500, error)
	}
}
