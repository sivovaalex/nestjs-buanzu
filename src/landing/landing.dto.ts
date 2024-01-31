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

    @IsOptional()
    lead_name?: string

    @IsOptional()
    lead_name_color?: string

    @IsOptional()
    lead_subtitle?: string

    @IsOptional()
    lead_subtitle_color?: string

    @IsOptional()
    name_color?: string

    @IsOptional()
    text_color?: string

    @IsOptional()
    about_name?: string

    @IsOptional()
    about_text?: string

    @IsOptional()
    client_name?: string

    @IsOptional()
    client_list?: string[]

    @IsOptional()
    photo_name?: string

    @IsOptional()
    plus_name?: string

    @IsOptional()
    plus_list?: string[]

    @IsOptional()
    plus_description_list?: string[]

    @IsOptional()
    plan_name?: string

    @IsOptional()
    plan_list?: string[]

    @IsOptional()
    button_name?: string

    @IsOptional()
    button_list?: string[]

    @IsOptional()
    button_link_list?: string[]

    @IsOptional()
    contact_name?: string

    @IsOptional()
    contact_text?: string

    @IsOptional()
    phone_number?: string

    @IsOptional()
    vk?: string

    @IsOptional()
    tg?: string

    @IsOptional()
    mail?: string

    @IsOptional()
    address_name?: string

    @IsOptional()
    address?: string

    @IsOptional()
    map_link?: string

    @IsNotEmpty()
    id_user?: User
}


export class UpdateLandingDto extends PartialType(CreateLandingDto) {}