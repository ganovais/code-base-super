export class UserEntity {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date()
	) {}

	static create(id: string, name: string, email: string): UserEntity {
		return new UserEntity(id, name, email, new Date(), new Date())
	}
}
