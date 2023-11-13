import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  Delete,
  NotFoundException,
  UseInterceptors, UploadedFile, UploadedFiles,
  Res,
  Patch,
} from "@nestjs/common";
//import { Site } from './site/site.model';
import { Site } from './site.entity';
import { SiteDto, SiteDtoWithPath } from './site.dto';
import { SiteService } from './site.service';
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
export class SiteController{
  constructor(private siteService: SiteService) {}
//начальная страница
    @Get()
    @Render('index')
    async index() {
        return {
            posts: await this.siteService.find(),
        };
    }
//вывод данных о сайте с id_site (при нажатии на этот сайт)
    @Get('sites/:id_site')
    @Render('site')
    async getByIdSite(@Param('id_site', ParseIntPipe) id_site: number) {
        const site = await this.siteService.getSiteById(id_site);
        console.log(site, id_site);
        return { site, id_site };
    }
//форма для заполнения информации о сайте с дальнейшем созданием
    @Get('create')
    @Render('create-site')
    getForm(): void {
        return;
    }
//отправка запроса на создание сайта: запись в бд, генерация сайта
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
      console.log(body);
      console.log(Object.entries(files));
      const site = await this.siteService.saveSite(body, files);
      console.log(site);
      const url_id = Number(site.id_site);
      return { url: 'archive/' + url_id, statusCode: 301 };
    }


    @Get('archive/:id_site')
    @Render('archive')
    //получать файл (архив) с данными
    async archiveByIdSite(@Param('id_site', ParseIntPipe) id_site: number) {
        // const site = await this.siteRepository.findOne({ where: { id_site } });
        const site = await this.siteService.getSiteById(id_site)
            // {
            //     where:
            //         {
            //             id_site: id_site
            //         }
            // });

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
            id_site
        };
    }
//показ сгенерированного сайта с id_site 
    @Get('show_site/:id_site')
    showSite(@Param('id_site', ParseIntPipe) id_site: number, @Res() res: Response) {
      console.log('idSite ', id_site)
      const pugFilePath =  `../history_sites/views/site_${id_site}.pug`;
      res.render(pugFilePath);
    }

    // @Get('change_site/:id_site')
    // @Render('change-site')
    // async getSite(@Param('id_site') id_site: number): Promise<SiteDto> {
    //   return this.siteService.getSiteById(id_site);
    // }
  
    // @Patch('change_site/:id_site')
    // async updateSite(@Param('id_site') id_site: number, @Body() siteData: SiteDto): Promise<SiteDto> {
    //   return this.siteService.updateSite(id_site, siteData);
    // }
    // @Get('change_site/:id_site')
    // @Render('change-site')
    // async getSite(@Param('id_site') id_site: number): Promise<{ site: SiteDto, id_site: number }> {
    //   const site = await this.siteService.getSiteById(id_site);
    //   return { site, id_site };
    // }

    // @Patch('change_site/:id_site')
    // @Redirect()
    // async updateSite(@Param('id_site') id_site: number, @Body() updateSiteDto: SiteDto) {
    //   await this.siteService.updateSite(id_site, updateSiteDto);
    //   const id_site_str = id_site.toString();
    //   return { url: '/sites/'+id_site_str, statusCode: 301 };
    // }
    @Get('change_site/:id_site')
    @Render('change-site')
    async getSite(@Param('id_site') id_site: number) {
      console.log('Get change_site')
      const site = await this.siteService.getSiteById(id_site);
      console.log({ site, id_site })
      return { id_site, site };
    }
  
    @Post('change_site/:id_site')
    @Redirect('')
    async updateSite(@Param('id_site') id_site: number, @Body() updateSiteDto: SiteDto) {
      console.log('Post change_site')
      console.log(id_site, updateSiteDto)
      await this.siteService.updateSite(id_site, updateSiteDto);
      return { url: '/archive/' + id_site, statusCode: 301 };
    }

    @Delete('delete/:id_site')
    async deleteSite(@Param('id_site') id_site: string): Promise<void> {
      return this.siteService.deleteSite(id_site);
    }
  }
