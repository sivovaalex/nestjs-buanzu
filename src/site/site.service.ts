import { Injectable } from '@nestjs/common';

@Injectable()
export class SiteService {
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
      <meta name="description" content="{lead_name}">
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
        'color: rgb('+site.lead_name_color + ')">\n<div class="home_header">'+
        site.lead_name + '</div>\n' +
        (site.lead_subtitle? '<h1 style="color: rgb('+site.lead_subtitle_color+')">'+site.lead_subtitle+'</h1></section>\n':'') +
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
        '<section class="inner" id="button">' +
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

}