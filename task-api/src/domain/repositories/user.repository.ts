import { UserEntity } from '../entities/user.entity'

export interface IUserRepository {
	create(user: UserEntity): Promise<UserEntity>
	findById(id: string): Promise<UserEntity | null>
	findByEmail(email: string): Promise<UserEntity | null>
}
