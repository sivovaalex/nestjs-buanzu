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
  UseInterceptors, UploadedFile, UploadedFiles,
  Res,
} from "@nestjs/common";
import { Site } from './site/site.model';
import { SiteDto } from './site/site.dto';
import { SiteService } from './site/site.service';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import multer, { diskStorage } from "multer";
import {Response} from "express";
import { v4 as uuidv4 } from 'uuid';


interface FileParams {
  fileName : string;
}

@Controller()
export class AppController{
  constructor(private siteService: SiteService) {}

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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'icon', maxCount: 1 },
        { name: 'lead', maxCount: 1 },
        { name: 'about', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      { storage : diskStorage({
          destination : "./uploads",
          filename : (req , file , cb) => {
            cb(null , `${file.originalname}`)
          } }) }
    ))
    async create(@Body() body: SiteDto,
                          @UploadedFiles() files: { icon?: Express.Multer.File,
                            lead?: Express.Multer.File,
                            about?: Express.Multer.File,
                            gallery?: Express.Multer.File[]
                          }) {
      console.log(files);
      console.log(Object.entries(files));
  
      const site = new Site(
        body.title,
        body.site_name,
        files.icon ? files.icon[0].originalname : null, // сохраняем пути для иконки
        body.body_background,
        body.lead_name,
        body.lead_name_color,
        body.lead_subtitle,
        body.lead_subtitle_color,
        files.lead ? files.lead[0].originalname : null,
        body.name_color,
        body.text_color,
        body.about_name,
        body.about_text,
        files.about ? files.about[0].originalname : null,
        body.client_name,
        body.client_list,
        body.photo_name,
        files.gallery ? files.gallery.map((file) => file.originalname).join(';') : null,
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
      const url_id = Number({ id_site: site.getIdSite() }.id_site);
      return { url: 'archive/' + url_id, statusCode: 301 };
    }


    @Get('archive/:id_site')
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
        const htmlSiteContent = this.siteService.generateHtmlSiteContent(site);  
        fs.writeFileSync(htmlSitePath, htmlSiteContent);
        console.log(htmlSitePath, htmlSiteContent);
        // сохраняем паг для Просмотра
        const PugSitePath = path.join(dirAllCreatedSites, 'views',`site_${id_site}.pug`,);
        const PugSiteContent = this.siteService.generatePugSiteContent(site);  
        fs.writeFileSync(PugSitePath, PugSiteContent);
        console.log(PugSitePath);
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
        // копируем фото сайта в будущий архив
        const uploadFolder = 'uploads';
        const destinationStaticImageFolder = path.join(dirSitePath, 'static', 'images');
        // ВКЛЮЧИТЬ НА СЕРВЕРЕ, НА ЛОКАЛЕ НЕТ ДОСТУПА
        /*if (site.icon_path) {fs.copyFileSync(path.join(uploadFolder, site.icon_path), destinationStaticImageFolder);}
        if (site.lead_photo_path) {fs.copyFileSync(path.join(uploadFolder, site.lead_photo_path), destinationStaticImageFolder);}
        if (site.about_photo_path) {fs.copyFileSync(path.join(uploadFolder, site.about_photo_path), destinationStaticImageFolder);}
        if (site.gallery_list_path){
          const galleryArray = site.gallery_list_path.split(';');
          galleryArray.forEach(galleryPhoto => fs.copyFileSync(path.join(uploadFolder, galleryPhoto), destinationStaticImageFolder))
        }*/
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

    @Get('show_site/:id_site')
    showSite(@Param('id_site', ParseIntPipe) id_site: number, @Res() res: Response) {
      //const htmlPath = `history_sites/site_${idSite}/site_${idSite}.html`;
      //const cssPath = `history_sites/site_${idSite}/static/style.css`;
      //const pugTemplate = 'show_site'; // Имя Pug шаблона
      //const pugFilePath = path.join(__dirname, '..', 'history_sites', 'pugs', `site_${idSite}.pug`);
      console.log('idSite ', id_site)
      const pugFilePath =  `../history_sites/views/site_${id_site}.pug`;
      // Проверяем существование файлов и папок
      // if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath)) {
      //   res.status(404).send('Сайта не существует');
      //   return;
      // }
      //console.log(pugFilePath, cssPath)
      // Читаем содержимое файлов
      //const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      //const cssContent = fs.readFileSync(cssPath, 'utf8');
      //const pugContent = fs.readFileSync('history_sites/pugs/tr1.pug', 'utf8');
      // Рендеринг Pug кода
      //res.render(pugFilePath, { cssContent });
      res.render(pugFilePath);
      //res.render(pugTemplate, { htmlPath, cssPath });
    }


  }
