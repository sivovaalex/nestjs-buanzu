import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, ValidationPipe, UsePipes
} from "@nestjs/common";
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
// http://localhost:3001/api/user
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // регистрация пользователя
  @Post('/registration')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // http://localhost:3001/api/user
  // @Get()
  // findOne() {
  //   return this.userService.findOne();
  // }
}