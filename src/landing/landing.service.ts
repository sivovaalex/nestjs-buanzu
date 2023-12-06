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
      site_name: createLandingDto.site_name,
      title: createLandingDto.title,
      //icon_path: createLandingDto.icon_path,
      body_background: createLandingDto.body_background,
      lead_name: createLandingDto.lead_name,
      lead_name_color: createLandingDto.lead_name_color,
      lead_subtitle: createLandingDto.lead_subtitle,
      lead_subtitle_color: createLandingDto.lead_subtitle_color,
      //lead_photo_path: createLandingDto.lead_photo_path,
      name_color: createLandingDto.name_color,
      text_color: createLandingDto.text_color,
      about_name: createLandingDto.about_name,
      about_text: createLandingDto.about_text,
      //about_photo_path: createLandingDto.about_photo_path,
      client_name: createLandingDto.client_name,
      client_list: createLandingDto.client_list,
      photo_name: createLandingDto.photo_name,
      //gallery_list_path: createLandingDto.gallery_list_path,
      plus_name: createLandingDto.plus_name,
      plus_list: createLandingDto.plus_list,
      plan_name: createLandingDto.plan_name,
      plan_list: createLandingDto.plan_list,
      button_name: createLandingDto.button_name,
      button_list: createLandingDto.button_list,
      contact_name: createLandingDto.contact_name,
      contact_text: createLandingDto.contact_text,
      phone_number: createLandingDto.phone_number,
      vk: createLandingDto.vk,
      tg: createLandingDto.tg,
      mail: createLandingDto.mail,
      address_name: createLandingDto.address_name,
      address: createLandingDto.address,
      map_link: createLandingDto.map_link,

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