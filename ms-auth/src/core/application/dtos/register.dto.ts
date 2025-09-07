import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(2)
	@MaxLength(255)
	name!: string

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	email!: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(255)
	password!: string
}
