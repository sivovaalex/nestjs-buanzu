import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator"
import { User } from "../user/user.entity"
import { PartialType } from "@nestjs/mapped-types"


export class CreateLandingDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    site_name: string

    @IsOptional()
    body_background?: string

    @IsNotEmpty()
    id_user?: User
}


export class UpdateLandingDto extends PartialType(CreateLandingDto) {}