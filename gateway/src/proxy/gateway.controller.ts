import { Controller, All, Req, Res, Body, Headers } from '@nestjs/common'
import type { Response } from 'express'
import { ProxyService } from './proxy.service'
import type { AuthenticatedRequest, ForwardHeaders } from '../types/common.types'
import { hasStatus, getErrorMessage } from '../types/error.types'

@Controller('api')
export class GatewayController {
	constructor(private readonly proxyService: ProxyService) {}

	@All('auth/*')
	async forwardToAuth(
		@Req() req: AuthenticatedRequest,
		@Res() res: Response,
		@Body() body: unknown,
		@Headers() headers: Record<string, string>
	): Promise<void> {
		try {
			// Remove the /api prefix from the path
			const path = req.path.replace('/api', '')

			const response = await this.proxyService.forwardToAuthService(req.method, path, body, headers)

			res.status(response.status).json(response.data)
		} catch (error: unknown) {
			if (hasStatus(error)) {
				res.status(error.status).json(error.response || { message: getErrorMessage(error) })
			} else {
				res.status(500).json({ message: getErrorMessage(error) || 'Internal server error' })
			}
		}
	}

	@All('tasks/*')
	async forwardToTasks(
		@Req() req: AuthenticatedRequest,
		@Res() res: Response,
		@Body() body: unknown,
		@Headers() headers: Record<string, string>
	): Promise<void> {
		try {
			// Remove the /api prefix from the path
			const path = req.path.replace('/api', '')

			// Forward the user information from the JWT
			const forwardHeaders: ForwardHeaders = {
				...headers,
				...(req.user?.id && { 'x-user-id': req.user.id }),
				...(req.user?.email && { 'x-user-email': req.user.email }),
				'x-user-permissions': JSON.stringify(req.user?.permissions || [])
			}

			const response = await this.proxyService.forwardToTaskService(
				req.method,
				path,
				body,
				forwardHeaders
			)

			res.status(response.status).json(response.data)
		} catch (error: unknown) {
			if (hasStatus(error)) {
				res.status(error.status).json(error.response || { message: getErrorMessage(error) })
			} else {
				res.status(500).json({ message: getErrorMessage(error) || 'Internal server error' })
			}
		}
	}

	@All('tasks')
	async forwardToTasksRoot(
		@Req() req: AuthenticatedRequest,
		@Res() res: Response,
		@Body() body: unknown,
		@Headers() headers: Record<string, string>
	): Promise<void> {
		try {
			const path = '/tasks'

			// Forward the user information from the JWT
			const forwardHeaders: ForwardHeaders = {
				...headers,
				...(req.user?.id && { 'x-user-id': req.user.id }),
				...(req.user?.email && { 'x-user-email': req.user.email }),
				'x-user-permissions': JSON.stringify(req.user?.permissions || [])
			}

			const response = await this.proxyService.forwardToTaskService(
				req.method,
				path,
				body,
				forwardHeaders
			)

			res.status(response.status).json(response.data)
		} catch (error: unknown) {
			if (hasStatus(error)) {
				res.status(error.status).json(error.response || { message: getErrorMessage(error) })
			} else {
				res.status(500).json({ message: getErrorMessage(error) || 'Internal server error' })
			}
		}
	}
}
