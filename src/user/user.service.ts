import { BadRequestException, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { CreateUserDto,UpdateUserDto } from './user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export  class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({where: {email: createUserDto.email}})
    if (existUser) throw new BadRequestException('Этот емаил уже существует')
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password)
    })
    const token = this.jwtService.sign({email: createUserDto.email})
    return { user, token }
  }

  // findAll() {
  //   return "This action returns all user";
  // }

  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email } })
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}