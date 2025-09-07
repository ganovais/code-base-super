import { UserEntity } from '../entities/user.entity'
import { PermissionEntity } from '../entities/permission.entity'

export interface IUserRepository {
	create(user: UserEntity): Promise<UserEntity>
	findById(id: string): Promise<UserEntity | null>
	findByEmail(email: string): Promise<UserEntity | null>
	update(id: string, user: Partial<UserEntity>): Promise<UserEntity>
	delete(id: string): Promise<void>
	assignPermissions(userId: string, permissionIds: string[]): Promise<void>
	getUserPermissions(userId: string): Promise<PermissionEntity[]>
}
