import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete, ValidationPipe, UsePipes, UseGuards, Req, Query
} from "@nestjs/common";
import { LandingService } from './landing.service';
import { CreateLandingDto, UpdateLandingDto } from './landing.dto';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthorGuard } from "src/guard/author.guard";


@Controller('landings')
export class LandingController {

  constructor(private readonly landingService: LandingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  //@UsePipes(new ValidationPipe())
  create(@Body() createLandingDto: CreateLandingDto, @Req() req) {
    return this.landingService.create(createLandingDto, +req.user.id_user);
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
    return this.landingService.update(+id_landing, updateLandingDto);
  }

  @Delete(':type/:id_landing')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Param('id_landing') id_landing: string) {
    return this.landingService.remove(+id_landing);
  }

}