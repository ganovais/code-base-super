export interface JwtPayloadDto {
	sub: string // user ID
	email: string
	permissions: string[]
	iat?: number
	exp?: number
}
