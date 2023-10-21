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
  UseInterceptors, UploadedFile
} from "@nestjs/common";
import { Site } from './site.model';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

// const storage = diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })
// const upload = multer({ storage })

@Controller()
export class AppController{

    @Get()
    @Render('index')
    async index() {
        return {
            posts: await Site.find(),
        };
    }

    @Get('sites/:id_site')
    @Render('site')
    async getByIdSite(@Param('id_site', ParseIntPipe) id_site: number) {
        const site = await Site.findOne(
            {
                where:
                    {
                      id_site: id_site
                    }
            }
        );
        /*const options: FindOneOptions = {
          where: {
            id: id,
          },
        };
        const article = await Article.findOne(options);*/
        console.log(site);
        return site;
    }

    @Get('create')
    @Render('create-site')
    getForm(): void {
        return;
    }

    @Post('sites')
    @Redirect()
    // @UseInterceptors(FileFieldsInterceptor([
    //   { name: 'icon', maxCount: 1 },
    //   { name: 'photo_path_list', maxCount: 10 },
    // ]))
    //uploadFileAndPassValidation(
    async create(
      @Body()
        body: {
        title: string;
        site_name: string;
        icon: string;
        // icon и photo_path_list будут содержать массив файлов
        //icon: Express.Multer.File[];
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
        //photo_path_list: Express.Multer.File[];
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
      //@UploadedFile() files: { icon?: Express.Multer.File[], photo_path_list?: Express.Multer.File[]}
    ): Promise<{ url: string; statusCode: number }> {
      //console.log('files:', files)
      const site = new Site(
        body.title,
        body.site_name,
        body.icon,
        //body.icon.map(file => file.path), // сохраняем пути для иконки
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
        //body.photo_path_list.map(file => file.path), // сохраняем пути для фото
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
      await site.save();
      //return new RedirectResponse(`articles/archive/${article.getId()}`);
      const url_id = Number({ id_site: site.getIdSite() }.id_site);
      return { url: 'sites/archive/' + url_id, statusCode: 301 };
    }

    @Get('sites/archive/:id_site')
    @Render('archive')
    //получать файл (архив) с данными
    async archiveByIdSite(@Param('id_site', ParseIntPipe) id_site: number) {
        const site = await Site.findOne(
            {
                where:
                    {
                        id_site: id_site
                    }
            }
        );

        // Проверяем, есть ли статья с указанным id
        const dirAllCreatedSites = 'history_sites'
        if (!site) {
            throw new NotFoundException('Статья не найдена');
        }
        fs.mkdir(path.join(dirAllCreatedSites, `site_${id_site}`), (error) => {
            if (error) {
                console.error('Ошибка при создании папки:', error);
            } else {
                console.log('Папка успешно создана.');
            }
        });
        // Создаем текстовый файл с данными из статьи
        const dirSitePath = path.join(dirAllCreatedSites, `site_${id_site}`);
        const htmlSitePath = path.join(
          dirSitePath,
          `site_${id_site}.html`,
        );
        console.log(__dirname, __filename);

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
      // подготовим кнопки
      let htmlButton = '';
      if (site.button_name && site.button_list){
        const buttonArray: string[] = site.button_list.split(';');
        buttonArray.forEach((button) => {
          if (button.includes('(') && button.includes(')')){
            let regexButton = /^(.*?)\((.*?)\)$/;
            let matchButton = button.match(regexButton);
            if (matchButton) {
              htmlButton += `<a href="${matchButton[2]}" class="button" style="border: 2px solid ${site.name_color}; box-shadow: 7px 7px 7px ${site.name_color}; color: ${site.name_color};">${matchButton[1]}</a><br>`;
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
      ${site.title ? "<title>" + site.title + "</title>" : ""}
      <meta name="description" content="{lead_name}">
      <link rel="icon" href=${site.icon ? site.icon : "static/images/buanzu_logo.ico"} type="image/x-icon">
      <link rel="stylesheet" href="static/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    </head>
    <body style="background: ${site.body_background};">
      <header class="hide-on-mobile">
        <div class="inner">
        <a href="#home" class="logo">
        <img src=${site.icon ? site.icon : "static/images/buanzu_logo.png"} alt="" width="60" height="60"></a>
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
      ${(site.about_name && site.about_text) ? '<section class="about" id="about">' +
        '<div class="inner"><h1 style="color: '+ site.name_color + '">' + site.about_name + '</h1>' +
        '<div class="about_container">' +
        '<div class="about_text" style="color: ' + site.text_color + '"><img src=' + site.about_photo +
        ' alt="Фото" class="about_photo">' + site.about_text + 
        '</div></div></div></section>' : ""}
      ${(site.client_name && site.client_list) ? '<section class="client" id="client">' +
        '<div class="inner"><h1 style="padding: 20px 0; color:' + site.name_color + '">' + site.client_name + '</h1>' +
        '<ul class="border" style="color:' + site.text_color + '">' +
        site.client_list.split(";").map(client => `<li>${client}</li>`).join('') +
        '</ul></div></section>': ''}
      ${(site.photo_name && site.plus_list) ? '<section class="gallery" id="gallery">' +
        'div class="inner"><h1 style="padding: 20px 0; color: ' + site.name_color + '">' + site.photo_name + '</h1>' +
        '<div class="gallery">' +
        '' +
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
        const outputArchivePath = path.join(dirAllCreatedSites, `archive_${id_site}.zip`); // Путь для сохранения архива
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
        const site_name = site.site_name;
        return {
            site_name,
            outputArchivePath,
        };
    }
}
