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
} from '@nestjs/common';
import { Article } from './article.model';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { FindOneOptions } from "typeorm";

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
    /*async archiveById(@Param('id', ParseIntPipe) id: number) {
      const article = await Article.findOne({ id });
      console.log(article);
      return article;
    }*/
    async archiveById(@Param('id', ParseIntPipe) id: number) {
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
        // Проверяем, есть ли статья с указанным id
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }
        fs.mkdir(path.join('history_sites', `article_${id}`), (error) => {
            if (error) {
                console.error('Ошибка при создании папки:', error);
            } else {
                console.log('Папка успешно создана.');
            }
        });
        // Создаем текстовый файл с данными из статьи
        const dirSitePath = path.join('history_sites', `article_${id}`);
        const htmlSitePath = path.join(
            'history_sites',
            `article_${id}/article_${id}.html`,
        );
        console.log(__dirname, __filename);
        const htmlSiteContent = `
    Заголовок: ${article.title}
    Текст: ${article.site_name}
    `;

        fs.writeFileSync(htmlSitePath, htmlSiteContent);
        console.log(htmlSitePath, htmlSiteContent);
        // создаём архив для скачивания
        const outputArchivePath = path.join('history_sites', `archive_${id}`); // Путь для сохранения архива
        // Создаем поток для записи архива
        const output = fs.createWriteStream(outputArchivePath);
        const archive = archiver('zip', { zlib: { level: 9 } }); // Используем ZIP формат архива с максимальным уровнем сжатия

        // Передаем потоку записи архива
        archive.pipe(output);

        // Добавляем файлы из указанной папки в архив
        archive.directory(dirSitePath, false); // false означает, что папка будет добавлена в архив

        // Закрываем архив
        archive.finalize();
        // Возвращаем объект, содержащий данные для отображения в шаблоне
        return {
            article,
            dirSitePath,
            htmlSitePath,
            outputArchivePath,
        };
    }
}
