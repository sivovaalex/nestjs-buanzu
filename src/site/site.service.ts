import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import {Site} from './site.model';
import { Site } from './site.entity';
import { Repository } from 'typeorm';
import { SiteDto, SiteDtoWithPath } from './site.dto';

@Injectable()
export class SiteService {

  //constructor(@InjectRepository(Site) private readonly siteRepository: Repository<Site>) {}
  constructor(@InjectRepository(Site) private siteRepository: Repository<Site>) {}
//find all sites for show by index
  async find(): Promise<Site[]> {
    return this.siteRepository.find();
  }

  // async findOne(id_site: number): Promise<Site> {
  //   return await this.siteRepository.findOne({ where: { id_site } });
  // }

  async getSiteById(id_site: number): Promise<SiteDto> {
    const site = await this.siteRepository.findOne({ where: { id_site } });
    const { id_site: _, ...siteData } = site;
    return siteData;
  }

  //async updateSite(id_site: number, siteData: SiteDto): Promise<SiteDto> {
    // await this.siteRepository.update(id_site, siteData);
    // return siteData;
  async updateSite(id_site: number, siteData: SiteDto): Promise<void> {
    console.log(siteData);
    await this.siteRepository.update(id_site, siteData);
  }

  async deleteSite(id_site: string): Promise<void> {
    await this.siteRepository.delete(id_site);
  }

  async saveSite(createSiteDto: SiteDto, files: any): Promise<Site> {

    const iconPath = files.icon ? files.icon[0].originalname : null;
    const leadPath = files.lead ? files.lead[0].originalname : null;
    const aboutPath = files.about ? files.about[0].originalname : null;
    const galleryPath = files.gallery ? files.gallery.map((file) => file.originalname).join(';') : null;

    const site = new Site();
    site.title = createSiteDto.title;
    site.site_name = createSiteDto.site_name;
    site.icon_path = iconPath;
    site.body_background = createSiteDto.body_background;
    site.lead_name = createSiteDto.lead_name;
    site.lead_name_color = createSiteDto.lead_name_color;
    site.lead_subtitle = createSiteDto.lead_subtitle;
    site.lead_subtitle_color = createSiteDto.lead_subtitle_color;
    site.lead_photo_path = leadPath;
    site.name_color = createSiteDto.name_color;
    site.text_color = createSiteDto.text_color;
    site.about_name = createSiteDto.about_name;
    site.about_text = createSiteDto.about_text;
    site.about_photo_path = aboutPath;
    site.client_name = createSiteDto.client_name;
    site.client_list = createSiteDto.client_list;
    site.photo_name = createSiteDto.photo_name;
    site.gallery_list_path = galleryPath;
    site.plus_name = createSiteDto.plus_name;
    site.plus_list = createSiteDto.plus_list;
    site.plan_name = createSiteDto.plan_name;
    site.plan_list = createSiteDto.plan_list;
    site.button_name = createSiteDto.button_name;
    site.button_list = createSiteDto.button_list;
    site.contact_name = createSiteDto.contact_name;
    site.contact_text = createSiteDto.contact_text;
    site.phone_number = createSiteDto.phone_number;
    site.vk = createSiteDto.vk;
    site.tg = createSiteDto.tg;
    site.mail = createSiteDto.mail;
    site.address_name = createSiteDto.address_name;
    site.address = createSiteDto.address;
    site.map_link = createSiteDto.map_link;

    return this.siteRepository.save(site);
  }

  generateHtmlPlus(site): string {
    // подготовим плюсы
    let htmlPlus = '';
    if (site.plus_name && site.plus_list){
      const plusArray: string[] = site.plus_list.split(';');
      plusArray.forEach((plus) => {
        if (plus.includes('(') && plus.includes(')')){
          let regexPlus = /^(.*?)\((.*?)\)$/;
          let matchPlus = plus.match(regexPlus);
          if (matchPlus) {
            htmlPlus += `<div class="card"><h2>${matchPlus[1]}</h2><p>${matchPlus[2]}</p></div>`;
          }
        } else {
            htmlPlus += `<div class="card"><h2>${plus}</h2></div>`;
        }
      })
    }
    return htmlPlus;
  }

  generateHtmlButton(site): string {
    let htmlButton = '';
    if (site.button_name && site.button_list) {
      const buttonArray: string[] = site.button_list.split(';');
      buttonArray.forEach((button) => {
        if (button.includes('(') && button.includes(')')) {
          let regexButton = /^(.*?)\((.*?)\)$/;
          let matchButton = button.match(regexButton);
          if (matchButton) {
            htmlButton += `<a href="${matchButton[2]}" class="button" style="border: 2px solid ${site.name_color}; box-shadow: 7px 7px 7px ${site.name_color}; color: ${site.name_color};">${matchButton[1]}</a><br>`;
          }
        }
      });
    }
    return htmlButton;
  }
  
  generateHtmlSiteContent(site): string {
    const htmlPlus = this.generateHtmlPlus(site);
    const htmlButton = this.generateHtmlButton(site);
    const htmlSiteContent = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${site.title ? "<title>" + site.title + "</title>" : ""}
      <meta name="description" content="${site.lead_name}">
      <link rel="icon" href=${site.icon_path ? site.icon_path : "static/images/buanzu_logo.ico"} type="image/x-icon">
      <link rel="stylesheet" href="static/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <body style="background: ${site.body_background};">
      <header class="hide-on-mobile">
        <div class="inner">
        <a href="#home" class="logo">
        <img src=${site.icon_path ? site.icon_path : "static/images/buanzu_logo.png"} alt="" width="60" height="60"></a>
        <ul class="menu">
          <li><a href="#home">Главная</a></li>
          ${site.about_name ? '<li><a href="#about">' + site.about_name + '</a></li>' : ""}
          ${site.client_name ? '<li><a href="#client">' + site.client_name + '</a></li>' : ""}
          ${site.photo_name ? '<li><a href="#gallery">' + site.photo_name + '</a></li>' : ""}
          ${site.plus_name ? '<li><a href="#plus">' + site.plus_name + '</a></li>' : ""}
          ${site.plan_name ? '<li><a href="#plan">' + site.plan_name + '</a></li>' : ""}
          ${site.contact_name ? '<li><a href="#contact">' + site.contact_name + '</a></li>' : ""}
          ${site.address_name ? '<li><a href="#address">' + site.address_name + '</a></li>' : ""}
        </ul></div>
      </header>
      ${(site.lead_name) ? '<section class="home" id="home" style="' +
        (site.lead_photo_path? 'background-image: url('+site.lead_photo_path+');' : '') +
        'color: '+site.lead_name_color + '">\n<div class="home_header">'+
        site.lead_name + '</div>\n' +
        (site.lead_subtitle? '<h1 style="color: '+site.lead_subtitle_color+'">'+site.lead_subtitle+'</h1></section>\n':'') +
        '</div></section>': ''}
      ${(site.about_name && site.about_text) ? '<section class="about" id="about">' +
        '<div class="inner"><h1 style="color: '+ site.name_color + '">' + site.about_name + '</h1>' +
        '<div class="about_container">' +
        '<div class="about_text" style="color: ' + site.text_color + '"><img src=' + site.about_photo_path +
        ' alt="Фото" class="about_photo">' + site.about_text + 
        '</div></div></div></section>' : ""}
      ${(site.client_name && site.client_list) ? '<section class="client" id="client">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + site.name_color + '">' + site.client_name + '</h1>' +
        '<ul class="border" style="color:' + site.text_color + '">' +
        site.client_list.split(";").map(client => `<li>${client}</li>`).join('') +
        '</ul></div></section>': ''}
      ${(site.photo_name && site.gallery_list_path) ? '<section class="gallery" id="gallery">' +
        'div class="inner"><h1 style="padding: 20px 0; color: ' + site.name_color + '">' + site.photo_name + '</h1>' +
        '<div class="gallery">' +
        '' + site.gallery_list_path.split(";").map(gallery_photo => `<div class="gallery_photo"><img src=static/images/photos/${gallery_photo} alt="photo"></div>\n`).join('') +
        '</div></div></section>' : ''}
      ${(site.plus_name && site.plus_list) ? '<section class="plus" id="plus">' +
        '<div class="inner"><h1 style="padding: 20px 0; color: ' + site.name_color + '">' + site.plus_name + '</h1>' +
        '<div class="card-container" style="color:' + site.text_color + '">' +
        htmlPlus + '</div></div></section>': ''}
      ${(site.plan_name && site.plan_list) ? '<section class="plan" id="plan">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + site.name_color + '">' + site.plan_name + '</h1>' +
        '<ol class="bullet" style="color:' + site.text_color + '">' +
        site.plan_list.split(";").map(plan => `<li>${plan}</li>`).join('') +
        '</ol></div></section>' : ''}
      ${(site.button_name && site.button_list) ? 
        '<section class="call_button" id="call_button">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + site.name_color + '">' + site.button_name + '</h1>' +
        htmlButton + '</div></section>' : ''}
      ${(site.contact_name && (site.contact_text || site.phone_number || site.vk || site.tg || site.mail)) ? 
        '<section class="contact" id="contact"><h1 style="color: ' + site.name_color + '">' + site.contact_name + '</h1>' +
        (site.contact_text ? '<div class="about_text" style="color:' + site.text_color + ';text-align: center;">' + site.contact_text + '</div>' : '') +
        ((site.phone_number || site.vk || site.tg || site.mail) ? 
          '<ul class="social-icons" style="color:' + site.text_color + '"' +
          (site.phone_number ? '<li><table><tr><td><a href="tel:+'+ site.phone_number + '"><img src="static/images/phone.png" width="50" height="50"></a></td></tr><tr><td>+' + site.phone_number + '</td></tr></table></li>':'') +
          (site.vk ? '<li><table><tr><td><a href="https://vk.com/'+ site.vk + '"><img src="static/images/vk.png" width="50" height="50"></a></td></tr><tr><td>@' + site.vk + '</td></tr></table></li>':'') +
          (site.tg ? '<li><table><tr><td><a href="https://t.me/'+ site.tg + '"><img src="static/images/tg.png" width="50" height="50"></a></td></tr><tr><td>@' + site.tg + '</td></tr></table></li>':'') +
          (site.mail ? '<li><table><tr><td><a href="mailto:'+ site.mail + '"><img src="static/images/mail.png" width="50" height="50"></a></td></tr><tr><td>' + site.mail + '</td></tr></table></li>':'') +
          '</ul>' : '') +
        '</div></section>' : ''}
      ${(site.address_name && site.address) ? '<section class="address" id="address"><div class="inner"><div class="foottable">' +
        '<div class="td"><h1 style="color:' + site.name_color + '">' + site.address_name + '</h1><br>' +
        '<p style="color: ' + site.text_color + '">' + site.address + '</p></div><br>' +
        (site.map_link ? '<iframe src="https://yandex.ru/map-widget/v1/-/' + site.map_link + '" ' + 'frameborder="1" allowfullscreen="true" style="position:relative;"></iframe>' : '') +
        '</div></div></section>' : ''}
      <footer>
        <div class="container">
          <div class="icon-container">
            <a href="https://t.me/buanzu_landing" target="_blank"><i class="fab fa-telegram"></i></a>
            <a href="https://vk.com/buanzu_landing" target="_blank"><i class="fab fa-vk"></i></a>
          </div>
          <div class="text-container">
            <p>Создано в платформе для создания лендингов без специальных навыков Буанзу</p>
          </div>
          <a href="https://buanzu.ru" target="_blank"><img src="static/images/buanzu_logo.png" alt="Фото" class="photo"></a>
        </div>
      </footer>
    </body></html>
    `;
    return htmlSiteContent;
  }

  generatePugPlus(site): string {
    // подготовим плюсы
    let PugPlus = '';
    if (site.plus_name && site.plus_list){
      const plusArray: string[] = site.plus_list.split(';');
      plusArray.forEach((plus) => {
        if (plus.includes('(') && plus.includes(')')){
          let regexPlus = /^(.*?)\((.*?)\)$/;
          let matchPlus = plus.match(regexPlus);
          if (matchPlus) {
            PugPlus += `\n            .card
              h2 ${matchPlus[1]}
              p ${matchPlus[2]}`;
          }
        } else {
          PugPlus += `\n            .card 
              h2 ${plus}`;
        }
      })
    }
    return PugPlus;
  }  

  generatePugButton(site): string {
    let PugButton = '';
    if (site.button_name && site.button_list) {
      const buttonArray: string[] = site.button_list.split(';');
      buttonArray.forEach((button) => {
        if (button.includes('(') && button.includes(')')) {
          let regexButton = /^(.*?)\((.*?)\)$/;
          let matchButton = button.match(regexButton);
          if (matchButton) {
            PugButton += `\n          a.button(href='${matchButton[2]}' style='border: 2px solid ${site.name_color}; box-shadow: 7px 7px 7px ${site.name_color}; color: ${site.name_color};') ${matchButton[1]}
            br`;
          }
        }
      });
    }
    return PugButton;
  }

  generatePugSiteContent(site): string {
    const PugPlus = this.generatePugPlus(site);
    const PugButton = this.generatePugButton(site);
    const PugSiteContent = `doctype html
html(lang='ru')
  head
    style
      include ../../styles/show_site.css
      include ../../static_general/style.css
  body
    a(href="/", class='button_to_main') На главную
    a(href="/sites/${site.id_site}", class='button_to_main', style="color: #bf4f31") Открыть опрос
    div(class='bordered' style='background: ${site.body_background}')
      ${(site.lead_name) ? `section#home.home(style="${(site.lead_photo_path) ? `background-image: url(${site.lead_photo_path});` : ''}color: ${site.lead_name_color}")
        .home_header ${site.lead_name}
        ${(site.lead_subtitle) ? `h1(style="color: ${site.lead_subtitle_color}") ${site.lead_subtitle}` : ''}`
      : ''}
      ${(site.about_name && site.about_text) ? `section#about.about
        .inner
          h1(style="color: ${site.name_color}") ${site.about_name}
          .about_container
            img.about_photo(src="${site.about_photo_path}" alt="Фото")
            .about_text(style="color:${site.text_color}") ${site.about_text}`
      : ""}
      ${(site.client_name && site.client_list) ? `section#client.client
        .inner
          h1(style="padding: 20px 0; color:${site.name_color}") ${site.client_name}
          ul.border(style="color:${site.text_color}")
            ${site.client_list.split(";").map(client => 'li '+ client).join('\n            ')}`
      : ""}
      ${(site.photo_name && site.gallery_list_path) ? `section#gallery.gallery
        .inner
          h1(style="color: ${site.name_color}") ${site.photo_name}
          .gallery
            ${site.gallery_list_path.split(";").map(gallery_photo => `.gallery_photo
              img(src='static/images/photos/${gallery_photo}' alt='photo')`).join('\n              ')}`
      : ''}
      ${(site.plus_name && site.plus_list) ? `section#plus.plus
        .inner
          h1(style="padding: 20px 0; color:${site.name_color}") ${site.plus_name}
          .card-container(style="color:${site.text_color}")`+ PugPlus
      : ''}
      ${(site.plan_name && site.plan_list) ? `section#plan.plan
        .inner
          h1(style="padding: 20px 0; color:${site.name_color}") ${site.plan_name}
          ol.bullet(style="color:${site.text_color}")
            ${site.plan_list.split(";").map(plan => `li ${plan}`).join('\n            ')}`
      : ''}
      ${(site.button_name && site.button_list) ? `section#call_button.call_button
        .inner(style="display: flex;flex-direction: column;align-items: center;")
          h1(style="padding: 20px 0; color:${site.name_color}") ${site.button_name}` + PugButton
      : ''}
      ${(site.contact_name && (site.contact_text || site.phone_number || site.vk || site.tg || site.mail)) ? 
        `section#contact.contact
        h1(style="color:${site.name_color}") ${site.contact_name}
        ${(site.contact_text) ? `.about_text(style='color:${site.text_color};text-align: center;') ${site.contact_text}` : ''}
        ${(site.phone_number || site.vk || site.tg || site.mail) ? 
          `ul.social-icons(style="color:${site.text_color}")
          ${(site.phone_number) ? `
          li
          table
            tbody
              tr
                td
                  a(href='tel:${site.phone_number}')
                    img(src='static/images/phone.png' width='50' height='50')
              tr
                td ${site.phone_number}`:''}
          ${(site.vk) ? `
          li
            table
              tbody
                tr
                  td
                    a(href='https://vk.com/${site.vk}')
                      img(src='static/images/vk.png' width='50' height='50')
                tr
                  td @${site.vk}`:''}
          ${(site.tg) ? `
          li
            table
              tbody
                tr
                  td
                    a(href='https://t.me/${site.tg}')
                      img(src='static/images/tg.png' width='50' height='50')
                tr
                  td @${site.tg}`:''}
          ${(site.mail) ?
          `li
            table
              tbody
                tr
                  td
                    a(href='mailto:${site.mail}')
                      img(src='static/images/mail.png' width='50' height='50')
                tr
                  td ${site.mail}`:''}`
            : ''}`
      : ''}
      ${(site.address_name && site.address) ? `section#address.address
        .inner
          .foottable
            .td
            h1(style="color:${site.name_color}") ${site.address_name}
            br
            p(style="color:${site.text_color}") ${site.address}
            br
            iframe(src="https://yandex.ru/map-widget/v1/-/${site.map_link}" frameborder='1' allowfullscreen='true' style='position:relative;')` 
      : ''}    
  footer
    .container
      .icon-container
        a(href='https://t.me/buanzu_landing' target='_blank')
          i.fab.fa-telegram
        a(href='https://vk.com/buanzu_landing' target='_blank')
          i.fab.fa-vk
      .text-container
        p Создано в платформе для создания лендингов без специальных навыков Буанзу
      a(href='https://buanzu.ru' target='_blank')
        img.photo(src='static/images/buanzu_logo.png' alt='Фото')
    `;
    return PugSiteContent;
  }

}