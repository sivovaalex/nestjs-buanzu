import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as argon2 from "argon2";
import { CreateLandingDto, UpdateLandingDto } from './landing.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Landing } from "./landing.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export  class LandingService {
  constructor(
    @InjectRepository(Landing)
    private readonly landingRepository: Repository<Landing>
    ){}
  
  async create(createLandingDto: CreateLandingDto, id_user: number) {
    const isExist = await this.landingRepository.findBy({site_name: createLandingDto.site_name})
    if(isExist.length) throw new BadRequestException('Сайт с таким названием уже существует, придумайте другое')
    const newLanding = {
      title: createLandingDto.title,
      site_name: createLandingDto.site_name,
      body_background: createLandingDto.body_background,
      user: {id_user},
    }
    return await this.landingRepository.save(newLanding);
  }
  
  async findAll(id_user: number) {
    return await this.landingRepository.find({
      where: {
        user: { id_user }
      },
      order: {
        createDate: 'DESC'
      }
    });
  }
  
  async findOne(id_landing: number) {
    const landing = await this.landingRepository.findOne({
      where: {id_landing}, 
      relations: {user: true}
    })
    if(!landing) throw new NotFoundException('Сайт не найден')
    return landing;
  }
  
  async update(id_landing: number, updateLandingDto: UpdateLandingDto) {
    const landing = await this.landingRepository.findOne({
      where: {id_landing},
    })
    if(!landing) throw new NotFoundException('Сайт не найден')
    return await this.landingRepository.update(id_landing, updateLandingDto);
  }
  
  async remove(id_landing: number) {
    const landing = await this.landingRepository.findOne({
      where: {id_landing},
    })
    if(!landing) throw new NotFoundException('Сайт не найден')
    return await this.landingRepository.delete(id_landing);
  }

  async findAllWithPagination(id_user: number, page: number, limit: number){
    const landings = await this.landingRepository.find({
      where: {
        user: { id_user }
      },
      relations: {
        user: true
      },
      order: {
        createDate: 'DESC'
      },
      take: limit,
      skip: (page - 1) * limit, 
    })
    return landings;
  }

}