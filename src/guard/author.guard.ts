import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { LandingService } from 'src/landing/landing.service';

// Проверка авторства пользователя в контексте редактирования
@Injectable()
export class AuthorGuard implements CanActivate{

    constructor(
        private readonly landingService: LandingService
    ){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { id_landing, type } = request.params
        let entity
        // если добавится ещё одна сущность, то её надо отобразить по аналогии с case=landing
        // и перекрестно добавить в .module для друг друга => providers: XService, imports: typeorm[X]
        switch (type) {
            case 'landing':
                entity = await this.landingService.findOne(id_landing)
                break;
            default:
                throw new NotFoundException('Что-то пошло не так...')
        }
        const user = request.user;
        if (entity && user && entity.user.id_user === user.id_user){
            return true;
        }
        throw new BadRequestException('В доступе отказано')
    }
}