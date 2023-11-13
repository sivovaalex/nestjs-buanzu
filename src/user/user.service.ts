import { BadRequestException, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CreateUserDto,UpdateUserDto } from './user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export  class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({where: {email: createUserDto.email}})
    if (existUser) throw new BadRequestException('Этот емаил уже существует')
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password)
    })
    return { user }
  }

  // findAll() {
  //   return "This action returns all user";
  // }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}