import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredPermissions = this.reflector.get<string[]>(
			'permissions',
			context.getHandler()
		)

		if (!requiredPermissions) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user = request.user

		if (!user || !user.permissions) {
			throw new ForbiddenException('No permissions found')
		}

		const userPermissions: string[] = Array.isArray(user.permissions)
			? user.permissions
			: []
		const hasPermission = requiredPermissions.every((permission) =>
			userPermissions.includes(permission)
		)

		if (!hasPermission) {
			throw new ForbiddenException('Insufficient permissions')
		}

		return true
	}
}

export const Permissions = (permissions: string[]) => {
	return (
		// target: any,
		// propertyName: string,
		descriptor: PropertyDescriptor
	) => {
		Reflect.defineMetadata('permissions', permissions, descriptor.value)
	}
}
