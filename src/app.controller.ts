import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  NotFoundException,
  UploadedFile, UploadedFiles,
} from "@nestjs/common";
import { Article } from './article.model';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';



@Controller()
export class AppController{

    @Get()
    @Render('index')
    async index() {
        return {
            posts: await Article.find(),
        };
    }

    @Get('articles/:id')
    @Render('article')
    async getById(@Param('id', ParseIntPipe) id: number) {
        const article = await Article.findOne(
            {
                where:
                    {
                        id: id
                    }
            }
        );
        /*const options: FindOneOptions = {
          where: {
            id: id,
          },
        };
        const article = await Article.findOne(options);*/
        console.log(article);
        return article;
    }

    @Get('create')
    @Render('create-article')
    getForm(): void {
        return;
    }

    @Post('articles')
    @Redirect()
    async create(
      @Body()
        body: {
        title: string;
        site_name: string;
        icon: string;
        body_background: string;
        lead_name: string;
        lead_name_color: string;
        lead_subtitle: string;
        lead_subtitle_color: string;
        lead_photo: string;
        name_color: string;
        text_color: string;
        about_name: string;
        about_text: string;
        about_photo: string;
        client_name: string;
        client_list: string;
        photo_name: string;
        photo_path_list: string;
        plus_name: string;
        plus_list: string;
        plan_name: string;
        plan_list: string;
        button_name: string;
        button_list: string;
        contact_name: string;
        contact_text: string;
        phone_number: string;
        vk: string;
        tg: string;
        mail: string;
        address_name: string;
        address: string;
        map_link: string;
      },
    ): Promise<{ url: string; statusCode: number }> {
      const article = new Article(
        body.title,
        body.site_name,
        body.icon,
        body.body_background,
        body.lead_name,
        body.lead_name_color,
        body.lead_subtitle,
        body.lead_subtitle_color,
        body.lead_photo,
        body.name_color,
        body.text_color,
        body.about_name,
        body.about_text,
        body.about_photo,
        body.client_name,
        body.client_list,
        body.photo_name,
        body.photo_path_list,
        body.plus_name,
        body.plus_list,
        body.plan_name,
        body.plan_list,
        body.button_name,
        body.button_list,
        body.contact_name,
        body.contact_text,
        body.phone_number,
        body.vk,
        body.tg,
        body.mail,
        body.address_name,
        body.address,
        body.map_link,
      );
      await article.save();
      //return new RedirectResponse(`articles/archive/${article.getId()}`);
      const url_id = Number({ id: article.getId() }.id);
      return { url: 'articles/archive/' + url_id, statusCode: 301 };
    }

    @Get('articles/archive/:id')
    @Render('archive')
    //получать файл (архив) с данными
    async archiveById(@Param('id', ParseIntPipe) id: number) {
        const article = await Article.findOne(
            {
                where:
                    {
                        id: id
                    }
            }
        );

        // Проверяем, есть ли статья с указанным id
        const dirAllCreatedSites = 'history_sites'
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }
        fs.mkdir(path.join(dirAllCreatedSites, `article_${id}`), (error) => {
            if (error) {
                console.error('Ошибка при создании папки:', error);
            } else {
                console.log('Папка успешно создана.');
            }
        });
        // Создаем текстовый файл с данными из статьи
        const dirSitePath = path.join(dirAllCreatedSites, `article_${id}`);
        const htmlSitePath = path.join(
          dirSitePath,
          `article_${id}.html`,
        );
        console.log(__dirname, __filename);

      // подготовим плюсы
      let htmlPlus = '';
      if (article.plus_name && article.plus_list){
        const plusArray: string[] = article.plus_list.split(';');
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
      // подготовим кнопки
      let htmlButton = '';
      if (article.button_name && article.button_list){
        const buttonArray: string[] = article.button_list.split(';');
        buttonArray.forEach((button) => {
          if (button.includes('(') && button.includes(')')){
            let regexButton = /^(.*?)\((.*?)\)$/;
            let matchButton = button.match(regexButton);
            if (matchButton) {
              htmlButton += `<a href="${matchButton[2]}" class="button" style="border: 2px solid ${article.name_color}; box-shadow: 7px 7px 7px ${article.name_color}; color: ${article.name_color};">${matchButton[1]}</a><br>`;
            }
          }
        })
      }

      const htmlSiteContent = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${article.title ? "<title>" + article.title + "</title>" : ""}
      <meta name="description" content="{lead_name}">
      <link rel="icon" href=${article.icon ? article.icon : "static/images/buanzu_logo.ico"} type="image/x-icon">
      <link rel="stylesheet" href="static/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <body style="background: ${article.body_background};">
      <header class="hide-on-mobile">
        <div class="inner">
        <a href="#home" class="logo">
        <img src=${article.icon ? article.icon : "static/images/buanzu_logo.png"} alt="" width="60" height="60"></a>
        <ul class="menu">
          <li><a href="#home">Главная</a></li>
          ${article.about_name ? '<li><a href="#about">' + article.about_name + '</a></li>' : ""}
          ${article.client_name ? '<li><a href="#client">' + article.client_name + '</a></li>' : ""}
          ${article.photo_name ? '<li><a href="#gallery">' + article.photo_name + '</a></li>' : ""}
          ${article.plus_name ? '<li><a href="#plus">' + article.plus_name + '</a></li>' : ""}
          ${article.plan_name ? '<li><a href="#plan">' + article.plan_name + '</a></li>' : ""}
          ${article.contact_name ? '<li><a href="#contact">' + article.contact_name + '</a></li>' : ""}
          ${article.address_name ? '<li><a href="#address">' + article.address_name + '</a></li>' : ""}
        </ul></div>
      </header>
      ${(article.about_name && article.about_text) ? '<section class="about" id="about">' +
        '<div class="inner"><h1 style="color: '+ article.name_color + '">' + article.about_name + '</h1>' +
        '<div class="about_container">' +
        '<div class="about_text" style="color: ' + article.text_color + '"><img src=' + article.about_photo +
        ' alt="Фото" class="about_photo">' + article.about_text + 
        '</div></div></div></section>' : ""}
      ${(article.client_name && article.client_list) ? '<section class="client" id="client">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + article.name_color + '">' + article.client_name + '</h1>' +
        '<ul class="border" style="color:' + article.text_color + '">' +
        article.client_list.split(";").map(client => `<li>${client}</li>`).join('') +
        '</ul></div></section>': ''}
      ${(article.photo_name && article.plus_list) ? '<section class="gallery" id="gallery">' +
        'div class="inner"><h1 style="padding: 20px 0; color: ' + article.name_color + '">' + article.photo_name + '</h1>' +
        '<div class="gallery">' +
        '' +
        '</div></div></section>' : ''}
      ${(article.plus_name && article.plus_list) ? '<section class="plus" id="plus">' +
        '<div class="inner"><h1 style="padding: 20px 0; color: ' + article.name_color + '">' + article.plus_name + '</h1>' +
        '<div class="card-container" style="color:' + article.text_color + '">' +
        htmlPlus + '</div></div></section>': ''}
      ${(article.plan_name && article.plan_list) ? '<section class="plan" id="plan">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + article.name_color + '">' + article.plan_name + '</h1>' +
        '<ol class="bullet" style="color:' + article.text_color + '">' +
        article.plan_list.split(";").map(plan => `<li>${plan}</li>`).join('') +
        '</ol></div></section>' : ''}
      ${(article.button_name && article.button_list) ? 
        '<section class="inner" id="button">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + article.name_color + '">' + article.button_name + '</h1>' +
        htmlButton + '</div></section>' : ''}
      ${(article.contact_name && (article.contact_text || article.phone_number || article.vk || article.tg || article.mail)) ? 
        '<section class="contact" id="contact"><h1 style="color: ' + article.name_color + '">' + article.contact_name + '</h1>' +
        (article.contact_text ? '<div class="about_text" style="color:' + article.text_color + ';text-align: center;">' + article.contact_text + '</div>' : '') +
        ((article.phone_number || article.vk || article.tg || article.mail) ? 
          '<ul class="social-icons" style="color:' + article.text_color + '"' +
          (article.phone_number ? '<li><table><tr><td><a href="tel:+'+ article.phone_number + '"><img src="static/images/phone.png" width="50" height="50"></a></td></tr><tr><td>+' + article.phone_number + '</td></tr></table></li>':'') +
          (article.vk ? '<li><table><tr><td><a href="https://vk.com/'+ article.vk + '"><img src="static/images/vk.png" width="50" height="50"></a></td></tr><tr><td>@' + article.vk + '</td></tr></table></li>':'') +
          (article.tg ? '<li><table><tr><td><a href="https://t.me/'+ article.tg + '"><img src="static/images/tg.png" width="50" height="50"></a></td></tr><tr><td>@' + article.tg + '</td></tr></table></li>':'') +
          (article.mail ? '<li><table><tr><td><a href="mailto:'+ article.mail + '"><img src="static/images/mail.png" width="50" height="50"></a></td></tr><tr><td>' + article.mail + '</td></tr></table></li>':'') +
          '</ul>' : '') +
        '</div></section>' : ''}
      ${(article.address_name && article.address) ? '<section class="address" id="address"><div class="inner"><div class="foottable">' +
        '<div class="td"><h1 style="color:' + article.name_color + '">' + article.address_name + '</h1><br>' +
        '<p style="color: ' + article.text_color + '">' + article.address + '</p></div><br>' +
        (article.map_link ? '<iframe src="https://yandex.ru/map-widget/v1/-/' + article.map_link + '" ' + 'frameborder="1" allowfullscreen="true" style="position:relative;"></iframe>' : '') +
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
        fs.writeFileSync(htmlSitePath, htmlSiteContent);
        console.log(htmlSitePath, htmlSiteContent);

        //скопируем стили и общие лого
        function copyFolder(source, destination) {
          // Создаем папку назначения, если ее нет
          if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
          }
          // Получаем список файлов и подпапок в папке источника
          const files = fs.readdirSync(source);
          // Рекурсивно копируем каждый файл или подпапку
          files.forEach(file => {
            const sourcePath = path.join(source, file);
            const destinationPath = path.join(destination, file);

            if (fs.lstatSync(sourcePath).isDirectory()) {
              copyFolder(sourcePath, destinationPath);
            } else {
              fs.copyFileSync(sourcePath, destinationPath);
            }
          });
        }
        // Пример вызова функции для копирования папки
        const sourceStaticFolder = 'static_general';
        const destinationStaticFolder = path.join(dirSitePath, 'static');
        copyFolder(sourceStaticFolder, destinationStaticFolder);
        // создаём архив для скачивания
        const outputArchivePath = path.join(dirAllCreatedSites, `archive_${id}.zip`); // Путь для сохранения архива
        const outputArchive = fs.createWriteStream(outputArchivePath);
        const archive = archiver('zip', {
          zlib: { level: 9 } // настройка уровня сжатия
        });
        outputArchive.on('close', () => {
          console.log('Архив создан');
        });
        archive.on('error', (err) => {
          throw err;
        });
        archive.directory(dirSitePath, false);
        archive.pipe(outputArchive);
        archive.finalize();
        // Возвращаем объект, содержащий данные для отображения в шаблоне
        const site_name = article.site_name;
        return {
            site_name,
            outputArchivePath,
        };
    }
}
