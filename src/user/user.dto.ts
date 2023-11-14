import { IsEmail, MinLength } from "class-validator"


export class CreateUserDto {
    @IsEmail()
    email: string

    @MinLength(8, {message: "Пароль должен быть не короче 8 символов"})
    password: string
}


export class UpdateUserDto {
    @IsEmail()
    email: string

    @MinLength(8, {message: "Пароль должен быть не короче 8 символов"})
    password: string
}