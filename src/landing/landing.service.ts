import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as argon2 from "argon2";
import { CreateLandingDto, UpdateLandingDto } from './landing.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Landing } from "./landing.entity";
import { JwtService } from "@nestjs/jwt";
import { SiteData } from 'src/types';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path'
import { Http2ServerRequest } from "http2";

@Injectable()
export  class LandingService {
  constructor(
    @InjectRepository(Landing)
    private readonly landingRepository: Repository<Landing>
    ){}
  
  async create(createLandingDto: CreateLandingDto, files: any, id_user: number) {
    const isExist = await this.landingRepository.findBy({site_name: createLandingDto.site_name})
    if(isExist.length) throw new BadRequestException('Сайт с таким названием уже существует, придумайте другое')
    console.log('files', files, createLandingDto)
    const newLanding = {
      site_name: createLandingDto.site_name,
      title: createLandingDto.title,
      // icon_path: files.icon ? files.icon[0].filename : null,
      body_background: createLandingDto.body_background,
      lead_name: createLandingDto.lead_name,
      lead_name_color: createLandingDto.lead_name_color,
      lead_subtitle: createLandingDto.lead_subtitle,
      lead_subtitle_color: createLandingDto.lead_subtitle_color,
      // lead_photo_path: files.lead ? files.lead[0].filename : null,
      name_color: createLandingDto.name_color,
      text_color: createLandingDto.text_color,
      about_name: createLandingDto.about_name,
      about_text: createLandingDto.about_text,
      // about_photo_path: files.about ? files.about[0].filename : null,
      client_name: createLandingDto.client_name,
      client_list: createLandingDto.client_list,
      photo_name: createLandingDto.photo_name,
      // gallery_list_path: files.gallery ? files.gallery.map((file) => file.filename).join(';') : null,
      plus_name: createLandingDto.plus_name,
      plus_list: createLandingDto.plus_list,
      plus_description_list: createLandingDto.plus_description_list,
      plan_name: createLandingDto.plan_name,
      plan_list: createLandingDto.plan_list,
      button_name: createLandingDto.button_name,
      button_list: createLandingDto.button_list,
      button_link_list: createLandingDto.button_link_list,
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

  async generateSiteData(id_landing: number) {
    const landing = await this.landingRepository.findOne({where: {id_landing}});
    console.log(landing, landing.client_list===null)
    if (landing.lead_name_color===null) {landing.lead_name_color = '#000'}
    console.log(landing.lead_name_color)
    if (landing.lead_subtitle_color===null) {landing.lead_subtitle_color = '#000'}
    if (landing.name_color===null) {landing.name_color = '#000'}
    if (landing.text_color===null) {landing.text_color = '#000'}
    if (landing.body_background===null) {landing.body_background = '#fff'}
    const html = 
    `<html>
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${(landing.title!=="" && landing.title!==null) ? `<title>${landing.title}</title>` : ``}
      ${(landing.about_text!=="" && landing.about_text!==null) ? `<meta name="description" content="${landing.lead_name}">` : ``}
      ${landing.icon_path!==null ? `<link rel="icon" href="static/images/${landing.icon_path}" type="image/x-icon">`: ``}
      <link rel="stylesheet" href="static/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <body style="background: ${landing.body_background}">
    <header class="hide-on-mobile">
      <div class="inner">
      ${landing.icon_path!==null ? `<a href="#home" class="logo"><img src="static/images/${landing.icon_path}" alt="Лого" width="60" height="60"></a>`: ``}
        <ul class="menu">
          <li><a href="#home">Главная</a></li>
          ${(landing.about_name!=="" && landing.about_name!==null) ? `<li><a href="#about">${landing.about_name}</a></li>` : ``}
          ${(landing.client_name!=="" && landing.client_name!==null) ? `<li><a href="#about">${landing.client_name}</a></li>` : ``}
          ${(landing.photo_name!=="" && landing.photo_name!==null) ? `<li><a href="#about">${landing.photo_name}</a></li>` : ``}
          ${(landing.plus_name!=="" && landing.plus_name!==null) ? `<li><a href="#about">${landing.plus_name}</a></li>` : ``}
          ${(landing.plan_name!=="" && landing.plan_name!==null) ? `<li><a href="#about">${landing.plan_name}</a></li>` : ``}
          ${(landing.button_name!=="" && landing.button_name!==null) ? `<li><a href="#about">${landing.button_name}</a></li>` : ``}
          ${(landing.contact_name!=="" && landing.contact_name!==null) ? `<li><a href="#about">${landing.contact_name}</a></li>` : ``}
          ${(landing.address_name!=="" && landing.address_name!==null) ? `<li><a href="#about">${landing.address_name}</a></li>` : ``}
    </ul></div></header>
    ${(landing.lead_name!=="" && landing.lead_name!==null) ? 
                `<section class="home" id="home">
                <div class="home_text">
                    <div class="home_header" style="color: ${landing.lead_name_color}">${landing.lead_name}</div>
                    ${(landing.lead_subtitle!=="" && landing.lead_subtitle!==null) ? `<h1 style="font-size: 30px; color: ${landing.lead_subtitle_color}">${landing.lead_subtitle}</h1>` : ``}
                    ${(landing.lead_photo_path!==null) ? `<div class="home_photo"><img src="static/images/${landing.lead_photo_path}" alt="Фото лида"/></div>` : ``}
                </div></section>` : ``}

                ${(landing.about_name!=="" && landing.about_name!==null) ?
                      `<section class="about" id="about">
                      <div class="inner">
                        <h1 class="name" style="color: ${landing.name_color}">${landing.about_name}</h1>
                        ${(landing.about_text!=="" && landing.about_text!==null) ? 
                            `<div class="about_container">
                                <div class="about_text" style="color: ${landing.text_color}">
                                ${(landing.about_photo_path!==null) ? `<img src="static/images/${landing.about_photo_path}" alt="Фото О" class="about_photo" />` : ``}
                                ${landing.about_text}
                                </div>
                            </div>` : ``}
                      </div>
                </section>` : ``}

                ${(landing.client_name!=="" && landing.client_name!==null) ?
                `<section class="client" id="client">
                <div class="inner">
                  <h1 class="name" style="color: ${landing.name_color}">${landing.client_name}</h1>
                    ${(landing.client_list.length>0 && landing.client_list!==null) ?
                    `<ul class="border" style="color: ${landing.text_color}">
                        ${landing.client_list.map(client => `<li>${client}</li>`)}
                    </ul>` : ``}
                </div>
              </section>` : ``}

        ${(landing.photo_name!=="" && landing.photo_name!==null) ?
        `<section class="gallery" id="gallery">
        <div class="inner">
          <h1 class="name" style="color: ${landing.name_color}">${landing.photo_name}</h1>
          ${landing.gallery_list_path!==null ? 
            `<div class="gallery">${landing.gallery_list_path.split(";").map(photo => `<div class="gallery_photo"><img src="static/images/${photo}" alt="photo"/></div>`)}</div>`
            : ``}
        </div></section>` : ``}
      ${(landing.plus_name!=="" && landing.plus_name!==null) ?
      `<section class="plus" id="plus">
      <div class="inner">
        <h1 class="name" style="color: ${landing.name_color}">${landing.plus_name}</h1>
        ${(landing.plus_list.length>0 && landing.plus_list!==null) ?
        `<div class="card-container" style="color: #8A4E36">
            ${landing.plus_list.map((plus, index) => 
            `<div class="card">
                ${(landing.plus_description_list[index]) ? 
                `<div class="card">
                    <h2 style="color: ${landing.name_color}">${plus ?? ""}</h2>
                    <p style="color: ${landing.text_color}">${landing.plus_description_list[index] ?? ""}</p>
                </div>`
                : `<div class="card"><h2 style="color: ${landing.name_color}">${plus}</h2></div>`}
            </div>` )}
        </div>` : ``}
        </div></section>` : ``}

        ${(landing.plan_name!=="" && landing.plan_name!==null) ?
        `<section class="plan" id="plan">
        <div class="inner">
          <h1 class="name" style="color: ${landing.name_color}">${landing.plan_name}</h1>
          ${(landing.plan_list.length>0 && landing.plan_list!==null) ?
          `<ol class="bullet" style="color: ${landing.text_color}">
            ${landing.plan_list.map(plan => `<li>${plan}</li>`)}
          </ol>` : ``}
        </div></section>` : ``}

      ${(landing.button_name!=="" && landing.button_name!==null) ?
      `<section class="inner" id="button_start">
        <div class="inner">
          <h1 class="name" style="color: ${landing.name_color}">${landing.button_name}</h1>
          ${(landing.button_list.length>0 && landing.button_list!==null) ?
          landing.button_list.map((but, index) => 
            (landing.button_link_list[index]) &&
            `<a
            href=${landing.button_link_list[index] ?? ""}
            class="button_start"
            style="border: 2px solid #C95434; box-shadow: 7px 7px 7px #C95434; color: #C95434"
          >${but ?? ""}</a>`) 
          : ``}
        </div>
      </section>` : ``}

    ${(landing.contact_name!=="" && landing.contact_name!==null) ?
      `<section class="contact" id="contact">
        <h1 class="name" style="color: ${landing.name_color}">${landing.contact_name}</h1>
        <div>
          ${(landing.contact_text!=="" && landing.contact_text!==null) ?
          `<div class="about_text" style="text-align: center, color: ${landing.text_color}">
            ${landing.contact_text}
          </div>` : ``}
          ${((landing.phone_number!=="" && landing.phone_number!==null) || (landing.vk!=="" && landing.vk!==null) || 
            (landing.tg!=="" && landing.tg!==null) || (landing.mail!=="" && landing.mail!==null)) ?
          `<ul class="social-icons" style="color: #c95434">
            ${(landing.phone_number!=="" && landing.phone_number!==null) ? 
            `<li>
            <table>
              <tbody>
                <tr>
                  <td>
                    <a href=tel:+7${landing.phone_number} target="_blank">
                      <i class="fa-solid fa-phone" style="font-size:48px;color: ${landing.name_color}"></i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="lowercase" style="color: ${landing.text_color}">+7${landing.phone_number}</td>
                </tr>
              </tbody>
            </table>
          </li>` : ``}
            ${(landing.vk!=="" && landing.vk!==null) ?
                `<li>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <a href=https://vk.com/${landing.vk} target="_blank">
                      <i class="fab fa-vk" style="font-size:48px;color: ${landing.name_color}"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="lowercase" style="color: ${landing.text_color}">@${landing.vk}</td>
                  </tr>
                </tbody>
              </table>
            </li>` : ``}
            ${(landing.tg!=="" && landing.tg!==null) ?
            `<li>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <a href=https://t.me/${landing.tg} target="_blank">
                        <i class="fab fa-telegram" style="font-size:48px;color: ${landing.name_color}"></i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td class="lowercase" style="color: ${landing.text_color}">@${landing.tg}</td>
                  </tr>
                </tbody>
              </table>
            </li>` : ``}
            ${(landing.mail!=="" && landing.mail!==null) ?
            `<li>
            <table>
              <tbody>
                <tr>
                  <td>
                    <a href=mailto:${landing.mail} target="_blank">
                    <i class="fa-solid fa-envelope" style="font-size: 48px;color: ${landing.name_color}"></i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="lowercase" style="color: ${landing.text_color}">${landing.mail}</td>
                </tr>
              </tbody>
            </table>
          </li>` : ``}
          </ul>` : ``}
        </div>
      </section>` : ``}
    ${(landing.address_name!=="" && landing.address_name!==null) ?
      `<section class="address" id="address">
        <div class="inner">
          <div class="foottable">
              <h1 class="name" style="color: ${landing.name_color}">${landing.address_name}</h1>
              <br />
              ${(landing.address!=="" && landing.address!==null) ?
              `<p style="text-align: center;font-size: 20px;color: ${landing.text_color}">${landing.address}</p>`
              : ``}
            <br />
            ${(landing.map_link!=="" && landing.map_link!==null) ?
            `<iframe
            src=https://yandex.ru/map-widget/v1/-/${landing.map_link}
            frameBorder={1}
            allowFullScreen={true}
            class="cart"/>` : ``}
          </div>
        </div>
    </section>` : ``}
    </body>        
      ${(landing.lead_name!=="" && landing.lead_name!==null) ?
        `<footer>
        <div class="container_footer">
          <div class="icon-container">
            <a href="https://vk.com/buanzu_landing" target="_blank">
              <i class="fab fa-vk" style="font-size: 30px; color: #c95433"></i>
            </a>
          </div>
          <div class="text-container">
            <p>
              Создано в платформе для создания лендингов без специальных навыков Буанзу
            </p>
          </div>
          <a href="https://buanzu.ru" target="_blank">
            <img src="static/images/buanzu_logo.png" alt="Фото" class="photo_logo" />
          </a>
        </div>
      </footer>` 
      : `<h1 style="text-align: center;margin: 20px;font-size: 30px;">Ваш сайт пока пуст 😏, начните его заполнять в режиме Редактирования</h1>`}
      </div>
    </html>`;
    // Здесь реализуйте логику генерации данных о сайте, включая получение фото и css-файла
    const siteData = {
      icon: landing.icon_path ? 'uploads/'+landing.icon_path : undefined, // Фото указанные в landing.icon_path
      lead: landing.lead_photo_path ? 'uploads/'+landing.lead_photo_path : undefined,
      about: landing.about_photo_path ? 'uploads/'+landing.about_photo_path : undefined,
      gallery: landing.gallery_list_path ? 
        landing.gallery_list_path.split(';').map(e => `uploads/${e}`) : 
        undefined,
      cssFile: 'static_general/style.css', // Путь к css-файлу
      logoFile: 'static_general/images/buanzu_logo.png',
      htmlFile: html, // HTML-файл, сгенерированный из React-компонента
    };

    return siteData;
  }

  async createArchive(siteData: SiteData): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // Создание потока для записи архива
      const output = fs.createWriteStream('site_archive.zip');
      
      // Инициализация объекта для архивации
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      // Указываем поток для записи архива
      archive.pipe(output);
      console.log('serv')
      // Добавляем файлы в архив
      if (siteData.icon) {
        const iconName = path.basename(siteData.icon);
        console.log(siteData.icon, iconName)
        archive.file(siteData.icon, { name: 'static/images/'+iconName });
      }
      if (siteData.lead) {
        const leadName = path.basename(siteData.lead);
        console.log(siteData.lead, leadName)
        archive.file(siteData.lead, { name: 'static/images/'+leadName });
      }
      if (siteData.about) {
        const aboutName = path.basename(siteData.about);
        console.log(siteData.about, aboutName)
        archive.file(siteData.about, { name: 'static/images/'+aboutName });
      }
      if (siteData.gallery) {
        siteData.gallery.forEach((image) => {
          const imageName = path.basename(image);
          console.log(image, imageName)
          archive.file(image, { name: 'static/images/'+imageName });
        });
      }
      archive.file(siteData.logoFile, {name: 'static/images/buanzu_logo.png'})
      archive.file(siteData.cssFile, { name: 'static/style.css' });
      archive.append(siteData.htmlFile, { name: 'index.html' });

      // Завершение архивации
      archive.finalize();
      
      // Обработчики событий для завершения и ошибки архивации
      output.on('close', () => {
        resolve('site_archive.zip');
      });
      
      output.on('error', (error) => {
        reject(error);
      });
    });}

}