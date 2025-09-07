import { PermissionEntity } from '../entities/permission.entity'

export interface IPermissionRepository {
	create(permission: PermissionEntity): Promise<PermissionEntity>
	findById(id: string): Promise<PermissionEntity | null>
	findByName(name: string): Promise<PermissionEntity | null>
	findAll(): Promise<PermissionEntity[]>
	findByNames(names: string[]): Promise<PermissionEntity[]>
	update(id: string, permission: Partial<PermissionEntity>): Promise<PermissionEntity>
	delete(id: string): Promise<void>
}
