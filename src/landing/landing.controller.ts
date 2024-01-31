import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  Param,
  Delete, ValidationPipe, UsePipes, UseGuards, Req, Query,
  UploadedFiles, UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { LandingService } from './landing.service';
import { CreateLandingDto, UpdateLandingDto } from './landing.dto';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthorGuard } from "src/guard/author.guard";
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';


@Controller('landings')
export class LandingController {

  constructor(private readonly landingService: LandingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  //@UsePipes(new ValidationPipe())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'icon', maxCount: 1 },
    { name: 'lead', maxCount: 1 },
    { name: 'about', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ],
  { storage : diskStorage({
      destination : "./uploads",
      filename : (req , file , cb) => {
        const originalName = file.originalname.split(".");
        const uniqueNumber = uuidv4().substr(0, 8);
        const fileName = `${originalName[0]}_${uniqueNumber}.${originalName[1]}`;
        cb(null, fileName);
      } }) }
))
  create(
    @Body() createLandingDto: CreateLandingDto, 
    @UploadedFiles() files: { icon?: Express.Multer.File,
      lead?: Express.Multer.File,
      about?: Express.Multer.File,
      gallery?: Express.Multer.File[]
    },
    @Req() req
    ) {
    return this.landingService.create(createLandingDto, files, +req.user.id_user);
  }

  //url/landings/pagination?page=1&limit=3
  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  findAllWithPagination(
    @Req() req, 
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 3, 
  ){
    return this.landingService.findAllWithPagination(+req.user.id_user, +page, +limit)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.landingService.findAll(+req.user.id_user);
  }

// url/landings/landing/1
  @Get(':type/:id_landing')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  findOne(@Param('id_landing') id_landing: string) {
    return this.landingService.findOne(+id_landing);
  }

  @Patch(':type/:id_landing')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  update(@Param('id_landing') id_landing: string, @Body() updateLandingDto: UpdateLandingDto) {
    console.log(1, updateLandingDto)
    return this.landingService.update(+id_landing, updateLandingDto);
  }

  @Delete(':type/:id_landing')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Param('id_landing') id_landing: string) {
    return this.landingService.remove(+id_landing);
  }


  @Get('archive/:type/:id_landing')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async archiveByIdSite(@Param('id_landing') id_landing: string, @Res() res: Response) {
    console.log('archive')
    try {
      // Получаем данные о сгенерированном сайте
      const siteData = await this.landingService.generateSiteData(+id_landing);
      console.log(siteData)
      // Создаем архив
      const archivePath = await this.landingService.createArchive(siteData);
      console.log('archivePath', archivePath)
      // Отправляем клиенту сгенерированный архив
      res.download(archivePath, 'site_archive.zip');
    } catch (error) {
      console.error('Ошибка при скачивании архива:', error);
      res.status(500).json({ error: 'Ошибка при скачивании архива' });
    }
  }
}