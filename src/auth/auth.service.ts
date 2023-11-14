import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, UpdateAuthDto } from './auth.dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { IUser } from 'src/types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UserService, 
        private readonly jwtService: JwtService
        ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findOne(email);
        const passwordIsMatch = await argon2.verify(user.password, password);
        if (user && passwordIsMatch) {
          return user;
        }
        throw new UnauthorizedException('Пароль некорректен');
      }

    async login(user: IUser) {
        const {id_user, email} = user;
        return {id_user, 
            email, 
            token: this.jwtService.sign({id_user: user.id_user, email: user.email})}
      }
}